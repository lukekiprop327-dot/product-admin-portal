import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const store = { id: 1, name: "Coffee R Us", description: "Great coffee", phone_number: "555-5555" };
let products;

// Fake backend: mocks fetch for GET, POST, PATCH and DELETE
beforeEach(() => {
  products = [
    { id: 1, name: "Vanilla Bean", description: "Medium roast", origin: "Colombia", price: 10 },
    { id: 2, name: "House Blend", description: "Dark roast", origin: "Vietnam", price: 12 },
  ];

  global.fetch = vi.fn((url, options = {}) => {
    const method = options.method || "GET";
    const respond = (data) => Promise.resolve({ ok: true, json: () => Promise.resolve(data) });

    if (method === "POST") return respond({ id: 99, ...JSON.parse(options.body) });
    if (method === "PATCH") return respond({ ...products[0], ...JSON.parse(options.body) });
    if (method === "DELETE") return respond({});
    if (url.endsWith("/store_info")) return respond(store);
    return respond(products);
  });
});

const renderApp = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("Routing", () => {
  test("home page shows store info from the backend", async () => {
    renderApp("/");
    expect(await screen.findByText("Coffee R Us")).toBeInTheDocument();
  });

  test("navigates to the shop using the navbar", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("link", { name: "Shop" }));
    expect(await screen.findByText("Vanilla Bean")).toBeInTheDocument();
  });

  test("navigates to the admin portal", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("link", { name: "Admin Portal" }));
    expect(screen.getByRole("heading", { name: "Add Product" })).toBeInTheDocument();
  });

  test("unknown route shows not found page", () => {
    renderApp("/nonsense");
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});

describe("Shop search and filter", () => {
  test("displays products fetched with GET", async () => {
    renderApp("/shop");
    expect(await screen.findByText("Vanilla Bean")).toBeInTheDocument();
    expect(screen.getByText("House Blend")).toBeInTheDocument();
  });

  test("filters products by search term", async () => {
    const user = userEvent.setup();
    renderApp("/shop");
    await screen.findByText("Vanilla Bean");

    await user.type(screen.getByPlaceholderText("Search"), "house");

    expect(screen.queryByText("Vanilla Bean")).not.toBeInTheDocument();
    expect(screen.getByText("House Blend")).toBeInTheDocument();
  });

  test("filters products by origin checkbox", async () => {
    const user = userEvent.setup();
    renderApp("/shop");
    await screen.findByText("Vanilla Bean");

    await user.click(screen.getByLabelText("Colombia"));

    expect(screen.getByText("Vanilla Bean")).toBeInTheDocument();
    expect(screen.queryByText("House Blend")).not.toBeInTheDocument();
  });

  test("shows empty message when nothing matches", async () => {
    const user = userEvent.setup();
    renderApp("/shop");
    await screen.findByText("Vanilla Bean");

    await user.type(screen.getByPlaceholderText("Search"), "zzz");
    expect(screen.getByText("No products found.")).toBeInTheDocument();
  });
});

describe("Create, update, delete", () => {
  test("adds a product with POST from the admin portal", async () => {
    const user = userEvent.setup();
    renderApp("/admin");

    await user.type(screen.getByLabelText("Name"), "Ethiopia Blend");
    await user.type(screen.getByLabelText("Description"), "Floral and light");
    await user.type(screen.getByLabelText("Origin"), "Ethiopia");
    await user.type(screen.getByLabelText("Price"), "14");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText(/Ethiopia Blend/)).toBeInTheDocument();
    const postCall = global.fetch.mock.calls.find(([, opts]) => opts?.method === "POST");
    expect(postCall).toBeDefined();
  });

  test("shows field errors for an empty form", async () => {
    const user = userEvent.setup();
    renderApp("/admin");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Price must be greater than 0.")).toBeInTheDocument();
  });

  test("edits a product price with PATCH", async () => {
    const user = userEvent.setup();
    renderApp("/shop/1");

    await user.click(await screen.findByRole("button", { name: "Edit" }));
    const priceInput = screen.getByLabelText("Price");
    await user.clear(priceInput);
    await user.type(priceInput, "20");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("$20.00")).toBeInTheDocument();
  });

  test("deletes a product with DELETE and returns to the shop", async () => {
    const user = userEvent.setup();
    renderApp("/shop/1");

    await user.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByText("House Blend")).toBeInTheDocument();
    expect(screen.queryByText("Vanilla Bean")).not.toBeInTheDocument();
  });
});