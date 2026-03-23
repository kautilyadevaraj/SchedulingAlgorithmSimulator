#ifndef PROCESS_H
#define PROCESS_H

#include <string>

struct Process
{
    int process_id;
    int arrival_time;
    int burst_time;
    int priority;
    std::string background;

    Process() : process_id(0), arrival_time(0), burst_time(0), priority(0), background("") {}

    Process(int id, int arrival, int burst, const std::string &bg)
        : process_id(id), arrival_time(arrival), burst_time(burst), priority(0), background(bg) {}

    Process(int id, int arrival, int burst, int prio, const std::string &bg)
        : process_id(id), arrival_time(arrival), burst_time(burst), priority(prio), background(bg) {}
};

#endif // PROCESS_H
