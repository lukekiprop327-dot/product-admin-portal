import { useState, useId } from "react";

const emptyForm = { name: "", description: "", origin: "", price: "" };

export default function ProductForm({ onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const uid = useId(); // unique prefix so labels and inputs always match

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Returns an object of field errors (empty object means valid)
  const validate = () => {
    const found = {};
    if (!form.name.trim()) found.name = "Name is required.";
    if (!form.description.trim()) found.description = "Description is required.";
    if (!form.origin.trim()) found.origin = "Origin is required.";
    if (!(Number(form.price) > 0)) found.price = "Price must be greater than 0.";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate();
    setErrors(found);
    setSubmitError("");
    if (Object.keys(found).length > 0) return;

    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        origin: form.origin.trim(),
        price: Number(form.price),
      });
      setForm(emptyForm);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  // Builds the props shared by every field
  const field = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    className: errors[name] ? "invalid" : "",
    "aria-invalid": errors[name] ? "true" : "false",
  });

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Product</h2>

      <label htmlFor={`${uid}-name`}>Name</label>
      <input {...field("name")} placeholder="Type here" />
      {errors.name && <p className="field-error" role="alert">{errors.name}</p>}

      <label htmlFor={`${uid}-description`}>Description</label>
      <input {...field("description")} placeholder="Type here" />
      {errors.description && <p className="field-error" role="alert">{errors.description}</p>}

      <label htmlFor={`${uid}-origin`}>Origin</label>
      <input {...field("origin")} placeholder="Type here" />
      {errors.origin && <p className="field-error" role="alert">{errors.origin}</p>}

      <label htmlFor={`${uid}-price`}>Price</label>
      <input {...field("price")} type="number" step="0.01" placeholder="Type here" />
      {errors.price && <p className="field-error" role="alert">{errors.price}</p>}

      {submitError && <p className="field-error" role="alert">{submitError}</p>}
      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
}