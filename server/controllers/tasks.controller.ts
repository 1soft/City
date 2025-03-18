import DatabaseSingleton from "../services/mongo.service.ts";
import { Task } from "../models/task.model.ts";
import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { ObjectId } from "../deps.ts";

const db = await DatabaseSingleton.getInstance();
const tasksCollection = db.collection<Task>("tasks");

export const getTasks = async (ctx: RouterContext) => {
  try {
    const tasks = await tasksCollection.find({}).toArray();
    ctx.response.body = tasks;
    ctx.response.status = 200;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch tasks", details: error.message };
  }
};

export const addTask = async (ctx: RouterContext) => {
  const { title, description, done } = await ctx.request.body.json();
  const newTask: Task = { title, description, done, createdAt: new Date(), updatedAt: new Date() };
  await tasksCollection.insertOne(newTask);
  ctx.response.status = 201;
  ctx.response.body = newTask;
};

export const updateTask = async (ctx: RouterContext) => {
  try {
    const { id } = ctx.params;
    const { title, description, done } = await ctx.request.body.json()
    ;
    if (!id || !ObjectId.isValid(id)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid Task ID" };
      return;
    }
    const updatedTask = await tasksCollection.findAndModify(
      { _id: new ObjectId(id) },
      { update: { $set: { title, description, done, updatedAt: new Date() } }, new: true }
    );

    if (!updatedTask) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Task not found" };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};

export const deleteTask = async (ctx: RouterContext) => {
  try {
    const { id } = ctx.params;

    if (!id || !ObjectId.isValid(id)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid Task ID" };
      return;
    }

    const deleteCount = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    if (deleteCount === 0) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Task not found" };
      return;
    }

    ctx.response.status = 204; // No Content
  } catch (error) {
    console.error("Error deleting task:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
};
