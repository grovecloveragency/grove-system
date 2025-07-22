// api\src\__test__\task.controller.test.js

import {
  createTaskController,
  readAllActiveTasksController,
  readAllCompletedTasksController,
  readAllFailedTasksController,
  completeTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";

// Mock the entire task.service.js module
const mockTaskServices = {
  createTask: jest.fn(),
  readAllActiveTasks: jest.fn(),
  readAllCompletedTasks: jest.fn(),
  readAllFailedTasks: jest.fn(),
  completeTask: jest.fn(),
  deleteTask: jest.fn(),
};

// Jest's way to mock modules.
// When '../services/task.service.js' is imported, it will return our mock object.
jest.mock("../services/task.service.js", () => mockTaskServices);

describe("Task Controller", () => {
  // Define mock request and response objects for each test
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Reset mocks and create fresh req/res objects before each test
    jest.clearAllMocks();

    // Mock response object with chainable methods
    mockRes = {
      status: jest.fn().mockReturnThis(), // Allows chaining .status().json()
      json: jest.fn(),
    };
  });

  describe("createTaskController", () => {
    it("should create a task and return 201 status with data on success", async () => {
      // Arrange
      mockReq = {
        body: {
          title: "New Task",
          description: "Description of new task",
          deadline: new Date().toISOString(),
          priority: "High",
          usersId: "user123",
        },
      };
      const createdTask = {
        id: "task1",
        ...mockReq.body,
        status: "ACTIVE",
      };
      mockTaskServices.createTask.mockResolvedValue(createdTask);

      // Act
      await createTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.createTask).toHaveBeenCalledWith(
        mockReq.body.title,
        mockReq.body.description,
        mockReq.body.deadline,
        mockReq.body.priority,
        mockReq.body.usersId
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: createdTask,
      });
    });

    it("should return 404 status if any required field is missing", async () => {
      // Arrange: Missing title
      mockReq = {
        body: {
          description: "Description",
          deadline: new Date().toISOString(),
          priority: "High",
          usersId: "user123",
        },
      };

      // Act
      await createTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.createTask).not.toHaveBeenCalled(); // Service should not be called
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "All fields are required",
      });
    });

    it("should return 500 status and error message if service throws an error", async () => {
      // Arrange
      mockReq = {
        body: {
          title: "Existing Task",
          description: "Description",
          deadline: new Date().toISOString(),
          priority: "High",
          usersId: "user123",
        },
      };
      const errorMessage = "Task already exists";
      mockTaskServices.createTask.mockRejectedValue(new Error(errorMessage));

      // Act
      await createTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.createTask).toHaveBeenCalled(); // Service was called
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("readAllActiveTasksController", () => {
    it("should return 200 status with active tasks on success", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123" } };
      const activeTasks = [{ id: "t1", title: "Active Task" }];
      mockTaskServices.readAllActiveTasks.mockResolvedValue(activeTasks);

      // Act
      await readAllActiveTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllActiveTasks).toHaveBeenCalledWith(
        mockReq.params.usersId
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        total: activeTasks.length,
        data: activeTasks,
      });
    });

    it("should return 404 status if usersId is missing from params", async () => {
      // Arrange
      mockReq = { params: {} }; // Missing usersId

      // Act
      await readAllActiveTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllActiveTasks).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID not found in params",
      });
    });

    it("should return 400 status and error message if service throws an error", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123" } };
      const errorMessage = "Database error";
      mockTaskServices.readAllActiveTasks.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act
      await readAllActiveTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllActiveTasks).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("readAllCompletedTasksController", () => {
    it("should return 200 status with completed tasks on success", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123" } };
      const completedTasks = [{ id: "t1", title: "Completed Task" }];
      mockTaskServices.readAllCompletedTasks.mockResolvedValue(completedTasks);

      // Act
      await readAllCompletedTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllCompletedTasks).toHaveBeenCalledWith(
        mockReq.params.usersId
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        total: completedTasks.length,
        data: completedTasks,
      });
    });

    it("should return 404 status if usersId is missing from params", async () => {
      // Arrange
      mockReq = { params: {} }; // Missing usersId

      // Act
      await readAllCompletedTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllCompletedTasks).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID not found in params",
      });
    });

    it("should return 400 status and error message if service throws an error", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123" } };
      const errorMessage = "Database error";
      mockTaskServices.readAllCompletedTasks.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act
      await readAllCompletedTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllCompletedTasks).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("readAllFailedTasksController", () => {
    it("should return 200 status with failed tasks on success", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123" } };
      const failedTasks = [{ id: "t1", title: "Failed Task" }];
      mockTaskServices.readAllFailedTasks.mockResolvedValue(failedTasks);

      // Act
      await readAllFailedTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllFailedTasks).toHaveBeenCalledWith(
        mockReq.params.usersId
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        total: failedTasks.length,
        data: failedTasks,
      });
    });

    it("should return 404 status if usersId is missing from params", async () => {
      // Arrange
      mockReq = { params: {} }; // Missing usersId

      // Act
      await readAllFailedTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllFailedTasks).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID not found in params",
      });
    });

    it("should return 400 status and error message if service throws an error", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123" } };
      const errorMessage = "Database error";
      mockTaskServices.readAllFailedTasks.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act
      await readAllFailedTasksController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.readAllFailedTasks).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("completeTaskController", () => {
    it("should complete a task and return 200 status with data on success", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123", taskId: "task123" } };
      const completedTask = {
        id: "task123",
        title: "Task to Complete",
        status: "COMPLETED",
      };
      mockTaskServices.completeTask.mockResolvedValue(completedTask);

      // Act
      await completeTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.completeTask).toHaveBeenCalledWith(
        mockReq.params.usersId,
        mockReq.params.taskId
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: completedTask,
      });
    });

    it("should return 404 status if usersId or taskId is missing from params", async () => {
      // Arrange: Missing taskId
      mockReq = { params: { usersId: "user123" } };

      // Act
      await completeTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.completeTask).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID and Task ID not found in params",
      });
    });

    it("should return 500 status and error message if service throws an error", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123", taskId: "task123" } };
      const errorMessage = "Task not found or unauthorized";
      mockTaskServices.completeTask.mockRejectedValue(new Error(errorMessage));

      // Act
      await completeTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.completeTask).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe("deleteTaskController", () => {
    it("should delete a task and return 200 status with success message on success", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123", taskId: "task123" } };
      const deletedTask = { id: "task123", title: "Task to Delete" };
      mockTaskServices.deleteTask.mockResolvedValue(deletedTask);

      // Act
      await deleteTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.deleteTask).toHaveBeenCalledWith(
        mockReq.params.usersId,
        mockReq.params.taskId
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: `${deletedTask.title} deleted successfully`,
      });
    });

    it("should return 404 status if usersId or taskId is missing from params", async () => {
      // Arrange: Missing usersId
      mockReq = { params: { taskId: "task123" } };

      // Act
      await deleteTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.deleteTask).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User ID and Task ID not found in params",
      });
    });

    it("should return 500 status and error message if service throws an error", async () => {
      // Arrange
      mockReq = { params: { usersId: "user123", taskId: "task123" } };
      const errorMessage = "Task not found or unauthorized";
      mockTaskServices.deleteTask.mockRejectedValue(new Error(errorMessage));

      // Act
      await deleteTaskController(mockReq, mockRes);

      // Assert
      expect(mockTaskServices.deleteTask).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
