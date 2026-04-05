import React, { useEffect, useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Groceries",
  "Utilities",
  "Dining",
  "Entertainment",
  "Transport",
  "Other",
];

const DEFAULT_FORM = {
  amount: "",
  category: CATEGORIES[0],
  type: "expense",
  date: new Date().toISOString().slice(0, 16),
  tags: "",
  isRecurring: false,
};

export const TransactionForm = ({
  isOpen,
  onClose,
  initialData = null,
}) => {
  const { addTransaction, editTransaction } = useFinanceStore();

  const [formData, setFormData] = useState(DEFAULT_FORM);

  // 🧠 Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: initialData.amount.toString(),
        date: new Date(initialData.date).toISOString().slice(0, 16),
        tags: initialData.tags?.join(", ") || "",
        isRecurring: !!initialData.isRecurring,
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
  }, [initialData, isOpen]);

  // 🧠 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const dataToSave = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      date: formData.date, // keep local format (avoid timezone bug)
      tags: tagsArray,
    };

    if (initialData) {
      editTransaction({ ...dataToSave, id: initialData.id });
    } else {
      addTransaction(dataToSave);
    }

    // ✅ Reset form
    setFormData(DEFAULT_FORM);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TYPE */}
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-gray-200">
            Type
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={formData.type === "income" ? "default" : "outline"}
              className={
                formData.type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : ""
              }
              onClick={() =>
                setFormData({ ...formData, type: "income" })
              }
            >
              Income
            </Button>

            <Button
              type="button"
              variant={formData.type === "expense" ? "default" : "outline"}
              className={
                formData.type === "expense"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : ""
              }
              onClick={() =>
                setFormData({ ...formData, type: "expense" })
              }
            >
              Expense
            </Button>
          </div>
        </div>

        {/* AMOUNT + DATE */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-200">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-gray-200">
              Date
            </label>
            <Input
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-gray-200">
            Category
          </label>

          <Input
            list="categories-list"
            required
            placeholder="Type or select category..."
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
          <datalist id="categories-list">
            {Array.from(new Set([...CATEGORIES, ...useFinanceStore.getState().transactions.map(t => t.category)])).map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        {/* TAGS */}
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-gray-200">
            Tags (comma separated)
          </label>
          <Input
            type="text"
            placeholder="e.g. food, monthly"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
          />
        </div>

        {/* RECURRING */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="recurring"
            checked={formData.isRecurring}
            onChange={(e) =>
              setFormData({
                ...formData,
                isRecurring: e.target.checked,
              })
            }
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="recurring"
            className="text-sm font-medium dark:text-gray-200 cursor-pointer"
          >
            Mark as recurring transaction
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 px-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {initialData ? "Save Changes" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};