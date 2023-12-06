import request from "supertest";
import { app } from "../app";
import { Book } from "../models/book";

import * as bookService from "../services/books";
jest.mock("../services/books");

afterEach(() => {
	jest.clearAllMocks();
});

const dummyBookData = [
	{
		bookId: 1,
		title: "The Hobbit",
		author: "J. R. R. Tolkien",
		description: "Someone finds a nice piece of jewellery while on holiday.",
	},
	{
		bookId: 2,
		title: "The Shop Before Life",
		author: "Neil Hughes",
		description:
			"Before being born, each person must visit the magical Shop Before Life, where they choose what kind of person they will become down on Earth...",
	},
];

describe("GET /api/v1/books endpoint", () => {
	test("status code successfully 200", async () => {
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("books successfully returned as empty array when no data returned from the service", async () => {
		// Arrange
		jest.spyOn(bookService, "getBooks").mockResolvedValue([]);
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual([]);
		expect(res.body.length).toEqual(0);
	});

	test("books successfully returned as array of books", async () => {
		// Arrange

		// NB the "as" to `Book[]` takes care of all the missing properties added by sequelize
		//    such as createdDate etc, that we don't care about for the purposes of this test
		jest
			.spyOn(bookService, "getBooks")
			.mockResolvedValue(dummyBookData as Book[]);

		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual(dummyBookData);
		expect(res.body.length).toEqual(2);
	});
});

describe("GET /api/v1/books/{bookId} endpoint", () => {
	test("status code successfully 200 for a book that is found", async () => {
		// Arrange
		const mockGetBook = jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("status code successfully 404 for a book that is not found", async () => {
		// Arrange

		jest
			.spyOn(bookService, "getBook")
			// this is a weird looking type assertion!
			// it's necessary because TS knows we can't actually return unknown here
			// BUT we want to check that in the event a book is missing we return a 404
			.mockResolvedValue(undefined as unknown as Book);
		// Act
		const res = await request(app).get("/api/v1/books/77");

		// Assert
		expect(res.statusCode).toEqual(404);
		expect(res.type).toEqual("application/json");
		expect(res.text).toEqual(
			'{"message":"Book with ID 77 not found in the database"}'
		);
	});

	test("controller successfully returns book object as JSON", async () => {
		// Arrange
		jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.body).toEqual(dummyBookData[1]);
	});
});

describe("POST /api/v1/books endpoint", () => {
	test("status code successfully 201 for saving a valid book", async () => {
		//Arrange
		jest
			.spyOn(bookService, "getBooks")
			.mockResolvedValue(dummyBookData as Book[]);
		// Act
		const res = await request(app)
			.post("/api/v1/books")
			.send({ bookId: 3, title: "Fantastic Mr. Fox", author: "Roald Dahl" });

		// Assert
		expect(res.statusCode).toEqual(201);
	});

	test("status code 400 when saving ill formatted JSON", async () => {
		// Arrange - we can enforce throwing an exception by mocking the implementation
		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
			throw new Error("Error saving book");
		});

		// Act
		const res = await request(app)
			.post("/api/v1/books")
			.send({ title: "Fantastic Mr. Fox", author: "Roald Dahl" }); // No bookId

		// Assert
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual('{"message":"Error saving book"}');
	});

	test("status code 400 when saving a book that is already stored", async () => {
		// Arrange - we can enforce throwing an exception by mocking the implementation
		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
			throw new Error("Error saving book - bookID exists");
		});

		// Act
		const res = await request(app).post("/api/v1/books").send({
			bookId: 1,
			title: "The Hobbit",
			author: "J. R. R. Tolkien",
			description: "Someone finds a nice piece of jewellery while on holiday.",
		});

		// Assert
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual('{"message":"Error saving book - bookID exists"}');
	});
});

describe("DELETE /api/v1/books endpoint", () => {
	test("status code successfully 200 for deleting a valid book", async () => {
		jest.spyOn(bookService, "deleteBook").mockResolvedValue(1);
		const res = await request(app).delete("/api/v1/books/2");
		expect(res.statusCode).toEqual(200);
		expect(res.text).toEqual('{"message":"Book with ID 2 has been deleted"}');
	});

	test("status code returns 404 for deleting a book that doesn't exist", async () => {
		jest.spyOn(bookService, "deleteBook").mockResolvedValue(0);
		const res = await request(app).delete("/api/v1/books/5");
		expect(res.statusCode).toEqual(404);
		expect(res.text).toEqual('{"message":"Book with ID 5 has not be found"}');
	});

	test("status code returns 400 for deleting a book ID that is invalid", async () => {
		jest.spyOn(bookService, "deleteBook").mockImplementation(() => {
			throw new Error("Book ID is invalid");
		});

		const res = await request(app).delete("/api/v1/books/abcd");
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual('{"message":"Book ID is invalid"}');
	});
});

describe("PUT /api/v1/books endpoint", () => {
	test("status code successfully 200 for updating a valid book", async () => {
		jest.spyOn(bookService, "updateBook").mockResolvedValue([1]);
		const res = await request(app)
			.put("/api/v1/books/2")
			.send({ title: "A different book", author: "A Different author" });
		expect(res.statusCode).toEqual(204);
	});

	test("status code return error for updating a book that does not exist in the store", async () => {
		jest.spyOn(bookService, "updateBook").mockResolvedValue([0]);

		const res = await request(app)
			.put("/api/v1/books/4")
			.send({ title: "A book", author: "An author" });
		expect(res.statusCode).toEqual(400);
		expect(res.text).toEqual(
			'{"message":"Book with ID 4 does not exist so cannot be updated"}'
		);
	});
});

describe("invalid urls", () => {
	test("status code successfully 404 for invalid urls", async () => {
		const res = await request(app).get("/api/v1/authors/2");
		expect(res.statusCode).toEqual(404);
	});
});
