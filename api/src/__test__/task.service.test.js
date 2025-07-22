// api\src\__test__\task.service.test.js

import {
  createTask,
  readAllActiveTasks,
  readAllFailedTasks,
  readAllCompletedTasks,
  completeTask,
  deleteTask,
} from "../services/task.service.js";

// Mock the prisma client and the Status enum
// We need to mock the entire 'db.js' module because 'prisma' is imported from it.
const mockPrisma = {
  tasks: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock the Status enum as it's used in the service
const mockStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

// Mock the notification service
const mockCreateNotification = jest.fn();

// Jest's way to mock modules.
// When 'db.js' is imported, it will return our mockPrisma object.
jest.mock("../lib/db.js", () => ({
  prisma: mockPrisma,
}));

// When '@prisma/client' is imported, it will return our mockStatus enum.
// Note: This mock assumes Status is directly exported from '@prisma/client'.
// If it's part of a larger object, adjust the mock accordingly.
jest.mock("@prisma/client", () => ({
  Status: mockStatus,
}));

// When 'notification.service.js' is imported, it will return our mock function.
jest.mock("../services/notification.service.js", () => ({
  createNotification: mockCreateNotification,
}));

// Tests:

describe("Task Service", () => {
  // Clear all mocks before each test to ensure test isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a new task and send a notification if task does not exist", async () => {
      // Arrange: Set up mock responses for prisma
      mockPrisma.tasks.findUnique.mockResolvedValue(null); // No existing task
      const newTask = {
        id: "task123",
        title: "Test Task",
        description: "Description",
        deadline: new Date(),
        priority: "High",
        usersId: "user123",
        status: "ACTIVE",
      };
      mockPrisma.tasks.create.mockResolvedValue(newTask); // Task created successfully

      // Act: Call the service function
      const result = await createTask(
        newTask.title,
        newTask.description,
        newTask.deadline,
        newTask.priority,
        newTask.usersId
      );

      // Assert: Verify expectations
      expect(mockPrisma.tasks.findUnique).toHaveBeenCalledWith({
        where: { title: newTask.title },
      });
      expect(mockPrisma.tasks.create).toHaveBeenCalledWith({
        data: {
          title: newTask.title,
          description: newTask.description,
          deadline: newTask.deadline,
          priority: newTask.priority,
          usersId: newTask.usersId,
        },
      });
      expect(mockCreateNotification).toHaveBeenCalledWith(
        newTask.title,
        "Task created",
        newTask.usersId
      );
      expect(result).toEqual(newTask);
    });

    it("should throw an error if a task with the same title already exists", async () => {
      // Arrange: Set up mock response for prisma
      mockPrisma.tasks.findUnique.mockResolvedValue({
        id: "existingTask",
        title: "Existing Task",
      }); // Task already exists

      // Act & Assert: Expect the function to throw an error
      await expect(
        createTask("Existing Task", "Desc", new Date(), "Low", "user123")
      ).rejects.toThrow("Task already exists");

      // Assert that create was not called and notification was not sent
      expect(mockPrisma.tasks.create).not.toHaveBeenCalled();
      expect(mockCreateNotification).not.toHaveBeenCalled();
    });
  });

  describe("readAllActiveTasks", () => {
    it("should return all active tasks for a given user", async () => {
      // Arrange
      const userId = "user123";
      const activeTasks = [
        { id: "t1", title: "Active Task 1", status: "ACTIVE", usersId: userId },
        { id: "t2", title: "Active Task 2", status: "ACTIVE", usersId: userId },
      ];
      mockPrisma.tasks.findMany.mockResolvedValue(activeTasks);

      // Act
      const result = await readAllActiveTasks(userId);

      // Assert
      expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith({
        where: {
          usersId: userId,
          status: mockStatus.ACTIVE,
        },
        include: {
          users: true,
        },
      });
      expect(result).toEqual(activeTasks);
    });
  });

  describe("readAllFailedTasks", () => {
    it("should return all failed tasks for a given user", async () => {
      // Arrange
      const userId = "user123";
      const failedTasks = [
        { id: "f1", title: "Failed Task 1", status: "FAILED", usersId: userId },
      ];
      mockPrisma.tasks.findMany.mockResolvedValue(failedTasks);

      // Act
      const result = await readAllFailedTasks(userId);

      // Assert
      expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith({
        where: {
          usersId: userId,
          status: mockStatus.FAILED,
        },
        include: {
          users: true,
        },
      });
      expect(result).toEqual(failedTasks);
    });
  });

  describe("readAllCompletedTasks", () => {
    it("should return all completed tasks for a given user", async () => {
      // Arrange
      const userId = "user123";
      const completedTasks = [
        {
          id: "c1",
          title: "Completed Task 1",
          status: "COMPLETED",
          usersId: userId,
        },
      ];
      mockPrisma.tasks.findMany.mockResolvedValue(completedTasks);

      // Act
      const result = await readAllCompletedTasks(userId);

      // Assert
      expect(mockPrisma.tasks.findMany).toHaveBeenCalledWith({
        where: {
          usersId: userId,
          status: mockStatus.COMPLETED,
        },
        include: {
          users: true,
        },
      });
      expect(result).toEqual(completedTasks);
    });
  });

  describe("completeTask", () => {
    it("should update a task status to COMPLETED and send a notification", async () => {
      // Arrange
      const userId = "user123";
      const taskId = "task456";
      const updatedTask = {
        id: taskId,
        title: "Task to Complete",
        status: "COMPLETED",
        usersId: userId,
      };
      mockPrisma.tasks.update.mockResolvedValue(updatedTask);

      // Act
      const result = await completeTask(userId, taskId);

      // Assert
      expect(mockPrisma.tasks.update).toHaveBeenCalledWith({
        where: {
          id: taskId,
          usersId: userId,
        },
        data: {
          status: mockStatus.COMPLETED,
        },
      });
      expect(mockCreateNotification).toHaveBeenCalledWith(
        "Task completed",
        "Has completed the task",
        userId
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe("deleteTask", () => {
    it("should delete a task and send a notification", async () => {
      // Arrange
      const userId = "user123";
      const taskId = "task789";
      const deletedTask = {
        id: taskId,
        title: "Task to Delete",
        status: "ACTIVE",
        usersId: userId,
      };
      mockPrisma.tasks.delete.mockResolvedValue(deletedTask);

      // Act
      const result = await deleteTask(userId, taskId);

      // Assert
      expect(mockPrisma.tasks.delete).toHaveBeenCalledWith({
        where: {
          id: taskId,
          usersId: userId,
        },
      });
      expect(mockCreateNotification).toHaveBeenCalledWith(
        "Task deleted",
        "Has deleted the task",
        userId
      );
      expect(result).toEqual(deletedTask);
    });
  });
});
