#include "Algorithms.h"
#include <algorithm>

struct QueueItem {
    Process process;
    int remaining_time;
};

std::vector<Process> shortestRemainingTimeFirst(const std::vector<Process>& processes) {
    // Sort processes by arrival time
    std::vector<Process> sortedProcesses = processes;
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
        [](const Process& a, const Process& b) {
            return a.arrival_time < b.arrival_time;
        });

    std::vector<Process> result;
    std::vector<QueueItem> queue;
    int currentTime = 0;
    size_t index = 0;

    while (!queue.empty() || index < sortedProcesses.size()) {
        // Enqueue newly arrived processes
        while (index < sortedProcesses.size() &&
               sortedProcesses[index].arrival_time <= currentTime) {
            QueueItem item;
            item.process = sortedProcesses[index];
            item.remaining_time = sortedProcesses[index].burst_time;
            queue.push_back(item);
            index++;
        }

        // Sort the queue by remaining time (shortest remaining time first)
        std::sort(queue.begin(), queue.end(),
            [](const QueueItem& a, const QueueItem& b) {
                return a.remaining_time < b.remaining_time;
            });

        if (queue.empty()) {
            // Idle time until the next process arrives
            const Process& nextProcess = sortedProcesses[index];
            int gapDuration = nextProcess.arrival_time - currentTime;
            Process gap(-1, -1, gapDuration, "transparent");
            result.push_back(gap);
            currentTime += gapDuration;
        } else {
            // Pick the process with the shortest remaining time
            QueueItem item = queue[0];
            queue.erase(queue.begin());

            int executionTime = 1; // SRTF executes in 1 time unit intervals for preemption

            // Add the process slice to the result
            Process executed = item.process;
            executed.arrival_time = currentTime;
            executed.burst_time = executionTime;
            result.push_back(executed);

            currentTime += executionTime;

            // Re-check for newly arrived processes after execution
            while (index < sortedProcesses.size() &&
                   sortedProcesses[index].arrival_time <= currentTime) {
                QueueItem newItem;
                newItem.process = sortedProcesses[index];
                newItem.remaining_time = sortedProcesses[index].burst_time;
                queue.push_back(newItem);
                index++;
            }

            // If the process has remaining time, requeue it
            if (item.remaining_time > executionTime) {
                QueueItem requeue;
                requeue.process = item.process;
                requeue.remaining_time = item.remaining_time - executionTime;
                queue.push_back(requeue);
            }
        }
    }

    // Merge consecutive processes with the same process_id
    std::vector<Process> mergedResult;
    for (size_t i = 0; i < result.size(); i++) {
        const Process& currentProcess = result[i];

        if (!mergedResult.empty() &&
            mergedResult.back().process_id == currentProcess.process_id) {
            mergedResult.back().burst_time += currentProcess.burst_time;
        } else {
            mergedResult.push_back(currentProcess);
        }
    }

    return mergedResult;
}
