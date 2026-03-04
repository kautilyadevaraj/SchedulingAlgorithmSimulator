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

// Generate a random color (with high saturation)
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
  const lightness = 50 + Math.floor(Math.random() * 20); // 50-70%
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
    .gt(-1, { message: "El tiempo de llegada no puede ser negativo." }) // allow 0, disallow negatives
    .lte(100, { message: "El tiempo de llegada no puede ser mayor a 100." }),
  burst_time: z.coerce
    .number()
    .gt(0, { message: "El tiempo de ráfaga debe ser mayor a 0." }) // strictly positive
    .lte(100, { message: "El tiempo de ráfaga no puede ser mayor a 100." }),
  priority: z.coerce
    .number()
    .gt(0, { message: "La prioridad debe ser mayor a 0." })
    .lte(100, { message: "La prioridad no puede ser mayor a 100." }),
  background: z.string().nonempty({
    message: "Por favor, selecciona un color.",
  }),
});

type ProcessFormProps = {
  addProcess: (process: Omit<Process, "process_id">) => void;
  initialValues?: Process;
};

export function ProcessForm({ addProcess, initialValues }: ProcessFormProps) {
  const form = useForm<z.infer<typeof ProcessSchema>>({
    resolver: zodResolver(ProcessSchema),
    defaultValues: initialValues || {
      arrival_time: 0,
      burst_time: 1,
      priority: 1,
      background: generateRandomColor(),
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      // Generate new random color for new process
      form.setValue("background", generateRandomColor());
    }
  }, [initialValues, form]);

  const onSubmit = (data: z.infer<typeof ProcessSchema>) => {
    addProcess(data);
    form.reset({
      arrival_time: 0,
      burst_time: 1,
      priority: 1,
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
              <FormLabel>Tiempo de Llegada</FormLabel>
              <FormControl>
                <Input placeholder="Llegada por defecto: 0" {...field} />
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
              <FormLabel>Tiempo de Ráfaga</FormLabel>
              <FormControl>
                <Input placeholder="Ráfaga por defecto: 1" {...field} />
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
              <FormLabel>Prioridad</FormLabel>
              <FormControl>
                <Input placeholder="Prioridad por defecto: 1" {...field} />
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
              <FormLabel>Elegí un color para el proceso</FormLabel>
              <GradientPicker
                className="w-full truncate"
                background={field.value}
                setBackground={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-bold py-6">Agregar Proceso</Button>
      </form>
    </Form>
  );
}
