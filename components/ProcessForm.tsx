"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GradientPicker } from "./GradientPicker";
import { useEffect } from "react";

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 40);
  const lightness = 50 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

type Process = {
  arrival_time: number;
  burst_time: number;
  priority: number;
  background: string;
};

const ProcessSchema = z.object({
  arrival_time: z.coerce
    .number()
    .gt(-1, { message: "Arrival Time cannot be negative." })
    .lte(100, { message: "Arrival Time cannot be greater than 100." }),
  burst_time: z.coerce
    .number()
    .gt(0, { message: "Burst Time must be greater than 0." })
    .lte(100, { message: "Burst Time cannot be greater than 100." }),
  priority: z.coerce
    .number()
    .gte(0, { message: "Priority cannot be negative." })
    .lte(100, { message: "Priority cannot be greater than 100." }),
  background: z.string().nonempty({
    message: "Please select a background.",
  }),
});

type ProcessFormProps = {
  addProcess: (process: Process) => void;
  initialValues?: Process;
};

export function ProcessForm({ addProcess, initialValues }: ProcessFormProps) {
  const form = useForm<z.infer<typeof ProcessSchema>>({
    resolver: zodResolver(ProcessSchema),
    defaultValues: initialValues || {
      arrival_time: 0,
      burst_time: 1,
      priority: 0,
      background: generateRandomColor(),
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.setValue("background", generateRandomColor());
    }
  }, [initialValues, form]);

  const onSubmit = (data: z.infer<typeof ProcessSchema>) => {
    addProcess(data);
    form.reset({
      arrival_time: 0,
      burst_time: 1,
      priority: 0,
      background: generateRandomColor(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="arrival_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival Time</FormLabel>
              <FormControl>
                <Input placeholder="Default arrival time : 0" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="burst_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Burst Time</FormLabel>
              <FormControl>
                <Input placeholder="Default burst time : 1" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority (Lower number = Higher priority)</FormLabel>
              <FormControl>
                <Input placeholder="Default priority : 0" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose a color for the process</FormLabel>
              <GradientPicker
                className="w-full truncate"
                background={field.value}
                setBackground={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
