#include "Algorithms.h"
#include <algorithm>
#include <queue>

struct QueueItem {
    Process process;
    int remaining_time;
};

std::vector<Process> roundRobin(const std::vector<Process>& processes, int quantum) {
    // Sort processes by arrival time
    std::vector<Process> sortedProcesses = processes;
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
        [](const Process& a, const Process& b) {
            return a.arrival_time < b.arrival_time;
        });

    std::vector<Process> result;
    std::queue<QueueItem> queue;
    int currentTime = 0;
    size_t index = 0;

    while (!queue.empty() || index < sortedProcesses.size()) {
        // Enqueue newly arrived processes
        while (index < sortedProcesses.size() &&
               sortedProcesses[index].arrival_time <= currentTime) {
            QueueItem item;
            item.process = sortedProcesses[index];
            item.remaining_time = sortedProcesses[index].burst_time;
            queue.push(item);
            index++;
        }

        if (queue.empty()) {
            // Idle time until the next process arrives
            const Process& nextProcess = sortedProcesses[index];
            int gapDuration = nextProcess.arrival_time - currentTime;
            Process gap(-1, -1, gapDuration, "transparent");
            result.push_back(gap);
            currentTime += gapDuration;
        } else {
            // Dequeue a process and execute it for the quantum or until it finishes
            QueueItem item = queue.front();
            queue.pop();

            int executionTime = (item.remaining_time < quantum) ? item.remaining_time : quantum;

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
                queue.push(newItem);
                index++;
            }

            // If the process has remaining time, requeue it
            if (item.remaining_time > quantum) {
                QueueItem requeue;
                requeue.process = item.process;
                requeue.remaining_time = item.remaining_time - quantum;
                queue.push(requeue);
            }
        }
    }

    // Merge consecutive executions of the same process
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
