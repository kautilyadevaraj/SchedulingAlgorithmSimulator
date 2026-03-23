#include "Algorithms.h"
#include <algorithm>

std::vector<Process> shortestJobFirst(const std::vector<Process>& processes) {
    // Clone and sort the processes by arrival time
    std::vector<Process> sortedProcesses = processes;
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
        [](const Process& a, const Process& b) {
            return a.arrival_time < b.arrival_time;
        });

    std::vector<Process> result;
    std::vector<Process> availableProcesses;
    int currentTime = 0;
    size_t index = 0;

    while (index < sortedProcesses.size() || !availableProcesses.empty()) {
        // Move processes that have arrived by currentTime into available processes
        while (index < sortedProcesses.size() &&
               sortedProcesses[index].arrival_time <= currentTime) {
            availableProcesses.push_back(sortedProcesses[index]);
            index++;
        }

        // If there are available processes, pick the one with the shortest burst time
        if (!availableProcesses.empty()) {
            // Sort by burst time to find the shortest job
            std::sort(availableProcesses.begin(), availableProcesses.end(),
                [](const Process& a, const Process& b) {
                    return a.burst_time < b.burst_time;
                });

            Process nextProcess = availableProcesses[0];
            availableProcesses.erase(availableProcesses.begin());

            // Add the selected process to the result
            nextProcess.arrival_time = currentTime;
            result.push_back(nextProcess);

            currentTime += nextProcess.burst_time;
        } else {
            // If no processes are available, create an idle gap
            const Process& nextProcess = sortedProcesses[index];
            int gapDuration = nextProcess.arrival_time - currentTime;
            Process gap(-1, -1, gapDuration, "transparent");
            result.push_back(gap);
            currentTime += gapDuration;
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
