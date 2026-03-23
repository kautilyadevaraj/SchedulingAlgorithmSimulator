#include "Algorithms.h"
#include <algorithm>

std::vector<Process> firstComeFirstServe(const std::vector<Process>& processes) {
    // Sort processes by arrival time
    std::vector<Process> sortedProcesses = processes;
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
        [](const Process& a, const Process& b) {
            return a.arrival_time < b.arrival_time;
        });

    std::vector<Process> result;
    int currentTime = 0;

    for (size_t i = 0; i < sortedProcesses.size(); i++) {
        const Process& currentProcess = sortedProcesses[i];

        if (currentProcess.arrival_time > currentTime) {
            int gapDuration = currentProcess.arrival_time - currentTime;
            Process gap(-1, -1, gapDuration, "transparent");
            result.push_back(gap);
            currentTime = currentProcess.arrival_time;
        }

        result.push_back(currentProcess);
        currentTime += currentProcess.burst_time;
    }

    return result;
}
