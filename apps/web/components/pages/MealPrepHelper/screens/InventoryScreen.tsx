import React, { useState, useEffect } from "react";

interface Ingredient {
	name: string;
	unit: string;
	amount: string;
}

interface InventoryScreenProps {
	ingredients: Ingredient[];
	setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
	onContinue: () => void;
}
export default function InventoryScreen({ ingredients, setIngredients, onContinue }: InventoryScreenProps) {
	const [showModal, setShowModal] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
	const [unit, setUnit] = useState("");
	const [amount, setAmount] = useState("");

	// Load ingredient database from JSON
	const [ingredientDB, setIngredientDB] = useState<any[]>([]);
	useEffect(() => {
		import("@/mocked/mockedIngredients.json").then(mod => setIngredientDB(mod.default));
	}, []);

	const filteredIngredients = ingredientDB.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
	const [editingIdx, setEditingIdx] = useState<number | null>(null);

	const handleAdd = () => {
		setShowModal(true);
	};

	const handleModalAdd = () => {
		if (!selectedIngredient || !unit || !amount) return;
		// Blur any focused input to prevent iOS zoom lock
		if (typeof window !== "undefined" && document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
		// Reset viewport scale on iOS
		const viewport = document.querySelector('meta[name=viewport]');
		if (viewport) {
			viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
			setTimeout(() => {
				viewport.setAttribute('content', 'width=device-width, initial-scale=1');
			}, 300);
		}
		setIngredients([    
			...ingredients,
			{ name: `${selectedIngredient}`, unit, amount }
		]);
		setShowModal(false);
		setSearch("");
		setSelectedIngredient(null);
		setUnit("");
		setAmount("");
	};

    const selectIngredient = (ingredient: Ingredient) => {
        setSelectedIngredient(ingredient.name);
        setUnit("g");
        setAmount("100");
    }

    const deselectIngredient = () => {
        setSelectedIngredient(null);
        setUnit("");
        setAmount("");
    }

	return (
		<div>
			<section className="mb-5 text-center">
				<h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">Inventory</h2>
				<p className="text-sm text-neutral-700 dark:text-neutral-200">Add your available ingredients for the week.</p>
			</section>
			{/* Modal Popup */}
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
					<div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md shadow-lg">
						<h3 className="text-lg font-bold mb-2 text-center">Add Ingredient</h3>
						{!selectedIngredient ? (
							<>
								<input
									type="text"
									placeholder="Search ingredient..."
									value={search}
									onChange={e => setSearch(e.target.value)}
									className="w-full mb-2 rounded border px-2 py-1 bg-neutral-50 dark:bg-neutral-800"
									style={{ fontSize: 16 }}
									autoFocus
								/>
								<ul className="max-h-40 overflow-y-auto mb-2">
									{filteredIngredients.length === 0 && (
										<li className="text-sm text-neutral-500 px-2 py-1">No results</li>
									)}
									{filteredIngredients.map(i => (
										<li
											key={i.name}
											className="cursor-pointer px-2 py-1 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded"
											onClick={() => selectIngredient(i)}
										>
											{i.name}
										</li>
									))}
								</ul>
								<button
									className="mt-2 text-xs text-neutral-500 underline"
									onClick={() => {setShowModal(false); deselectIngredient();}}
								>Cancel</button>
							</>
						) : (
							<>
								<div className="mb-2">
									<span className="font-semibold">{selectedIngredient}</span>
									<button className="ml-2 text-xs text-yellow-600 underline" onClick={deselectIngredient}>Change</button>
								</div>
								<div className="mb-2">
									<label className="text-sm mr-2">Amount:</label>
									<input
										type="number"
										min="0"
										value={amount}
										onChange={e => setAmount(e.target.value)}
										className="rounded border px-2 py-1 bg-neutral-50 dark:bg-neutral-800 w-26"
										style={{ fontSize: 16 }}
									/>
									<select
										value={unit}
										onChange={e => setUnit(e.target.value)}
										className="rounded border px-2 py-1 bg-neutral-50 dark:bg-neutral-800 mx-2"
										style={{ fontSize: 16 }}
									>
										<option value="">Select unit</option>
										{ingredientDB.find(i => i.name === selectedIngredient)?.unitConversions.map((u: any) => (
											<option key={u.unit} value={u.unit}>{u.unit}</option>
										))}
									</select>
								</div>
								<div className="flex gap-2 mt-4 justify-center">
									<button
										className="rounded bg-neutral-200 dark:bg-neutral-700 px-4 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
										onClick={() => {setShowModal(false); deselectIngredient();}}
									>
                                        Cancel
                                    </button>
									<button
										className="rounded bg-yellow-600 dark:bg-yellow-400 px-4 py-1 text-xs font-semibold text-white dark:text-black hover:bg-yellow-700 dark:hover:bg-yellow-300"
										onClick={handleModalAdd}
										disabled={!unit || !amount}
									>
                                        Add
                                    </button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
			<section className="mb-4">
				<div className="overflow-x-auto w-full">
					<table className="min-w-full text-sm border-separate border-spacing-y-1">
						<thead>
							<tr className="text-neutral-700 dark:text-neutral-200">
								<th className="text-left px-2 py-1">Ingredient</th>
								<th className="text-left px-2 py-1">Amount</th>
								<th className="text-left px-2 py-1">Kcal</th>
								<th className="text-center px-2 py-1">P/F/C</th>
								<th className="text-left px-2 py-1"> </th>
							</tr>
						</thead>
						<tbody>
							{ingredients.length === 0 && (
								<tr><td colSpan={5} className="py-2 text-neutral-500 text-center">No ingredients added yet.</td></tr>
							)}
							{ingredients.map((ing, idx) => {
								// Nutrition calculation (copied from SummaryScreen logic)
								const db = ingredientDB.find(i => i.name === ing.name);
								const conv = db?.unitConversions.find((u: any) => u.unit === ing.unit);
								const grams = conv ? parseFloat(ing.amount) * conv.grams : 0;
								const nut = db && conv ? {
									kcal: grams * db.kcalPer1g,
									protein: grams * db.proteinPer1g,
									fat: grams * db.fatPer1g,
									carbs: grams * db.carbsPer1g,
								} : null;
								return (
									<tr key={idx} className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
										<td className="px-2 py-1">{ing.name}</td>
										<td className="px-2 py-1">
											{editingIdx === idx ? (
												<input
												type="number"
												min="0"
												value={ing.amount}
												autoFocus
												onBlur={() => setEditingIdx(null)}
												onChange={e => {
													const newAmount = e.target.value;
													setIngredients((ings: Ingredient[]) => ings.map((item, i) => i === idx ? { ...item, amount: newAmount } : item));
												}}
												className="rounded border px-2 py-1 text-sm w-20 bg-neutral-50 dark:bg-neutral-900 text-neutral-500"
											/>
											) : (
											<span className="flex items-center">
												<span className="text-neutral-500 mr-1 text-nowrap">{ing.amount} {ing.unit}</span>
												<button
												type="button"
												className="p-1 text-neutral-400 hover:text-yellow-600 cursor-pointer transition"
												onClick={() => setEditingIdx(idx)}
												aria-label="Edit amount"
												>
												<svg width="16" height="16" fill="none" viewBox="0 0 16 16">
													<path d="M2 13.5V14h.5l9.06-9.06-1.5-1.5L2 13.5zM14.06 4.06a1 1 0 0 0 0-1.41l-1.71-1.71a1 1 0 0 0-1.41 0l-.88.88 3.12 3.12.88-.88z" fill="currentColor"/>
												</svg>
												</button>
											</span>
											)}
									</td>
									<td className="px-2 py-1">{nut ? nut.kcal.toFixed(0) : '-'}</td>
									<td className="px-2 py-1 text-center">{nut ? nut.protein.toFixed(1) : '-'}/{nut ? nut.fat.toFixed(1) : '-'}/{nut ? nut.carbs.toFixed(1) : '-'}</td>
									<td className="px-2 py-1">
										<button
											type="button"
											className="p-1 text-neutral-400 hover:text-yellow-600 cursor-pointer transition"
											onClick={() => {
												setIngredients((ings: Ingredient[]) => ings.filter((_, i) => i !== idx));
											}}
											aria-label="Remove ingredient"
											>
											<svg width="16" height="16" fill="none" viewBox="0 0 16 16">
												<path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</button>
									</td>
								</tr>
							);
							})}
						</tbody>
					</table>
				</div>
			</section>
			<section className="text-center">
				<div className="text-right">
					<button
						type="button"
						className="rounded bg-yellow-600 dark:bg-yellow-400 px-4 py-2 text-sm font-semibold text-white dark:text-black shadow hover:bg-yellow-700 dark:hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
						onClick={handleAdd}
					>
						+ Add Ingredient
					</button>
				</div>
                {ingredients.length > 0 && (
                    <div className="mt-10">
                        <button
                            type="button"
                            className="rounded-full bg-yellow-600 dark:bg-yellow-400 px-8 py-2 text-sm font-semibold text-white dark:text-black shadow-lg hover:bg-yellow-700 dark:hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            onClick={onContinue}
                            disabled={ingredients.length === 0}
                        >
                            Get Nutritions
                        </button>
                    </div>
                )}
			</section>
		</div>
	);
}
