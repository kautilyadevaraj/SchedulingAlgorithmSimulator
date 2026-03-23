#include <node.h>
#include <node_object_wrap.h>
#include "Algorithms.h"
#include <vector>

namespace scheduling
{

    using v8::Array;
    using v8::Exception;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::NewStringType;
    using v8::Number;
    using v8::Object;
    using v8::String;
    using v8::Value;

    // Helper function to convert v8 Array of objects to std::vector<Process>
    std::vector<Process> ArrayToProcessVector(Isolate *isolate, Local<Array> array)
    {
        std::vector<Process> processes;

        for (uint32_t i = 0; i < array->Length(); i++)
        {
            Local<Value> element = array->Get(isolate->GetCurrentContext(), i).ToLocalChecked();

            if (!element->IsObject())
            {
                isolate->ThrowException(Exception::TypeError(
                    String::NewFromUtf8(isolate, "Array elements must be objects").ToLocalChecked()));
                return processes;
            }

            Local<Object> obj = element.As<Object>();

            // Extract properties
            Local<Value> id_val = obj->Get(isolate->GetCurrentContext(),
                                           String::NewFromUtf8(isolate, "process_id").ToLocalChecked())
                                      .ToLocalChecked();
            Local<Value> arrival_val = obj->Get(isolate->GetCurrentContext(),
                                                String::NewFromUtf8(isolate, "arrival_time").ToLocalChecked())
                                           .ToLocalChecked();
            Local<Value> burst_val = obj->Get(isolate->GetCurrentContext(),
                                              String::NewFromUtf8(isolate, "burst_time").ToLocalChecked())
                                         .ToLocalChecked();
            Local<Value> priority_val = obj->Get(isolate->GetCurrentContext(),
                                                 String::NewFromUtf8(isolate, "priority").ToLocalChecked())
                                            .ToLocalChecked();
            Local<Value> bg_val = obj->Get(isolate->GetCurrentContext(),
                                           String::NewFromUtf8(isolate, "background").ToLocalChecked())
                                      .ToLocalChecked();

            int id = id_val->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);
            int arrival = arrival_val->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);
            int burst = burst_val->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);
            int priority = priority_val->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);

            std::string background;
            if (bg_val->IsString())
            {
                v8::String::Utf8Value str(isolate, bg_val);
                background = std::string(*str);
            }

            processes.push_back(Process(id, arrival, burst, priority, background));
        }

        return processes;
    }

    // Helper function to convert std::vector<Process> to v8 Array of objects
    Local<Array> ProcessVectorToArray(Isolate *isolate, const std::vector<Process> &processes)
    {
        Local<Array> array = Array::New(isolate, processes.size());

        for (size_t i = 0; i < processes.size(); i++)
        {
            Local<Object> obj = Object::New(isolate);

            obj->Set(isolate->GetCurrentContext(),
                     String::NewFromUtf8(isolate, "process_id").ToLocalChecked(),
                     Number::New(isolate, processes[i].process_id))
                .Check();

            obj->Set(isolate->GetCurrentContext(),
                     String::NewFromUtf8(isolate, "arrival_time").ToLocalChecked(),
                     Number::New(isolate, processes[i].arrival_time))
                .Check();

            obj->Set(isolate->GetCurrentContext(),
                     String::NewFromUtf8(isolate, "burst_time").ToLocalChecked(),
                     Number::New(isolate, processes[i].burst_time))
                .Check();

            obj->Set(isolate->GetCurrentContext(),
                     String::NewFromUtf8(isolate, "priority").ToLocalChecked(),
                     Number::New(isolate, processes[i].priority))
                .Check();

            obj->Set(isolate->GetCurrentContext(),
                     String::NewFromUtf8(isolate, "background").ToLocalChecked(),
                     String::NewFromUtf8(isolate, processes[i].background.c_str()).ToLocalChecked())
                .Check();

            array->Set(isolate->GetCurrentContext(), i, obj).Check();
        }

        return array;
    }

    // First Come First Serve
    void FirstComeFirstServe(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();

        if (args.Length() < 1 || !args[0]->IsArray())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "First argument must be an array of processes").ToLocalChecked()));
            return;
        }

        Local<Array> input_array = args[0].As<Array>();
        std::vector<Process> processes = ArrayToProcessVector(isolate, input_array);

        std::vector<Process> result = firstComeFirstServe(processes);
        args.GetReturnValue().Set(ProcessVectorToArray(isolate, result));
    }

    // Round Robin
    void RoundRobin(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();

        if (args.Length() < 2 || !args[0]->IsArray() || !args[1]->IsNumber())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "Arguments must be: array of processes, quantum (number)").ToLocalChecked()));
            return;
        }

        Local<Array> input_array = args[0].As<Array>();
        int quantum = args[1]->Int32Value(isolate->GetCurrentContext()).FromMaybe(0);

        std::vector<Process> processes = ArrayToProcessVector(isolate, input_array);
        std::vector<Process> result = roundRobin(processes, quantum);

        args.GetReturnValue().Set(ProcessVectorToArray(isolate, result));
    }

    // Shortest Job First
    void ShortestJobFirst(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();

        if (args.Length() < 1 || !args[0]->IsArray())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "First argument must be an array of processes").ToLocalChecked()));
            return;
        }

        Local<Array> input_array = args[0].As<Array>();
        std::vector<Process> processes = ArrayToProcessVector(isolate, input_array);

        std::vector<Process> result = shortestJobFirst(processes);
        args.GetReturnValue().Set(ProcessVectorToArray(isolate, result));
    }

    // Shortest Remaining Time First
    void ShortestRemainingTimeFirst(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();

        if (args.Length() < 1 || !args[0]->IsArray())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "First argument must be an array of processes").ToLocalChecked()));
            return;
        }

        Local<Array> input_array = args[0].As<Array>();
        std::vector<Process> processes = ArrayToProcessVector(isolate, input_array);

        std::vector<Process> result = shortestRemainingTimeFirst(processes);
        args.GetReturnValue().Set(ProcessVectorToArray(isolate, result));
    }

    // Priority Non-Preemptive
    void PriorityNonPreemptive(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();

        if (args.Length() < 1 || !args[0]->IsArray())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "First argument must be an array of processes").ToLocalChecked()));
            return;
        }

        Local<Array> input_array = args[0].As<Array>();
        std::vector<Process> processes = ArrayToProcessVector(isolate, input_array);

        std::vector<Process> result = priorityNonPreemptive(processes);
        args.GetReturnValue().Set(ProcessVectorToArray(isolate, result));
    }

    // Priority Preemptive
    void PriorityPreemptive(const FunctionCallbackInfo<Value> &args)
    {
        Isolate *isolate = args.GetIsolate();

        if (args.Length() < 1 || !args[0]->IsArray())
        {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "First argument must be an array of processes").ToLocalChecked()));
            return;
        }

        Local<Array> input_array = args[0].As<Array>();
        std::vector<Process> processes = ArrayToProcessVector(isolate, input_array);

        std::vector<Process> result = priorityPreemptive(processes);
        args.GetReturnValue().Set(ProcessVectorToArray(isolate, result));
    }

    // Initialize the module
    void Initialize(Local<Object> exports)
    {
        NODE_SET_METHOD(exports, "firstComeFirstServe", FirstComeFirstServe);
        NODE_SET_METHOD(exports, "roundRobin", RoundRobin);
        NODE_SET_METHOD(exports, "shortestJobFirst", ShortestJobFirst);
        NODE_SET_METHOD(exports, "shortestRemainingTimeFirst", ShortestRemainingTimeFirst);
        NODE_SET_METHOD(exports, "priorityNonPreemptive", PriorityNonPreemptive);
        NODE_SET_METHOD(exports, "priorityPreemptive", PriorityPreemptive);
    }

    NODE_MODULE(scheduling_algorithms, Initialize)

} // namespace scheduling
