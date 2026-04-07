import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusBar } from "./StatusBar";

afterEach(cleanup);

describe("StatusBar", () => {
	it("renders the mobile footer with role, city and current year, but not the domain", () => {
		render(<StatusBar />);
		const year = String(new Date().getFullYear());
		const all = screen.getAllByText((_, el) => {
			const t = el?.textContent ?? "";
			return (
				t.includes("Lead AI Engineer") &&
				t.includes("London") &&
				t.includes(year) &&
				!t.includes("francescoalbanese.dev")
			);
		});
		expect(all.length).toBeGreaterThan(0);
	});

	it("renders the desktop pills row including the domain", () => {
		render(<StatusBar />);
		expect(screen.getByText("francescoalbanese.dev")).toBeInTheDocument();
		expect(screen.getByText("London, UK")).toBeInTheDocument();
	});
});
