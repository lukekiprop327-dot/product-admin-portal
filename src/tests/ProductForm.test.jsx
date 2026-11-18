import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../components/ProductForm";

test("submits form data to onSubmit", async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn().mockResolvedValue();
  render(<ProductForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText("Name"), "Test");
  await user.type(screen.getByLabelText("Description"), "Desc");
  await user.type(screen.getByLabelText("Origin"), "Kenya");
  await user.type(screen.getByLabelText("Price"), "5");
  await user.click(screen.getByRole("button", { name: "Submit" }));

  expect(handleSubmit).toHaveBeenCalledWith({
    name: "Test",
    description: "Desc",
    origin: "Kenya",
    price: 5,
  });
});