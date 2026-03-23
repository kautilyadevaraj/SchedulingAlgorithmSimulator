#include "Algorithms.h"
#include <algorithm>
#include <climits>

std::vector<Process> priorityNonPreemptive(const std::vector<Process> &processes)
{
    // Sort processes by arrival time first
    std::vector<Process> sortedProcesses = processes;
    std::sort(sortedProcesses.begin(), sortedProcesses.end(),
              [](const Process &a, const Process &b)
              {
                  return a.arrival_time < b.arrival_time;
              });

    std::vector<Process> result;
    std::vector<bool> completed(sortedProcesses.size(), false);
    int currentTime = 0;

    for (size_t i = 0; i < sortedProcesses.size(); i++)
    {
        int nextProcess = -1;
        int highestPriority = INT_MAX;

        // Find the highest priority process that has arrived and not completed
        for (size_t j = 0; j < sortedProcesses.size(); j++)
        {
            if (!completed[j] && sortedProcesses[j].arrival_time <= currentTime)
            {
                if (sortedProcesses[j].priority < highestPriority)
                {
                    highestPriority = sortedProcesses[j].priority;
                    nextProcess = j;
                }
            }
        }

        // If no process has arrived, jump to the next arrival time
        if (nextProcess == -1)
        {
            for (size_t j = 0; j < sortedProcesses.size(); j++)
            {
                if (!completed[j] && sortedProcesses[j].arrival_time > currentTime)
                {
                    int gapDuration = sortedProcesses[j].arrival_time - currentTime;
                    Process gap(-1, -1, gapDuration, 0, "transparent");
                    result.push_back(gap);
                    currentTime = sortedProcesses[j].arrival_time;
                    break;
                }
            }
            i = -1; // Restart the loop to find the next process
            continue;
        }

        // Execute the selected process
        const Process &currentProcess = sortedProcesses[nextProcess];
        result.push_back(currentProcess);
        currentTime += currentProcess.burst_time;
        completed[nextProcess] = true;
    }

    return result;
}
