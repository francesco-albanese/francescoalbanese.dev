import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusBar } from "./StatusBar";

afterEach(cleanup);

describe("StatusBar", () => {
	it("mobile footer shows role, city and year, omits the domain", () => {
		render(<StatusBar />);
		const mobile = screen.getByTestId("footer-mobile");
		const text = mobile.textContent ?? "";
		expect(text).toContain("Lead AI Engineer");
		expect(text).toContain("London");
		expect(text).toContain(String(new Date().getFullYear()));
		expect(text).not.toContain("francescoalbanese.dev");
	});

	it("desktop footer pills row includes the domain", () => {
		render(<StatusBar />);
		const desktop = screen.getByTestId("footer-desktop");
		expect(within(desktop).getByText("francescoalbanese.dev")).toBeInTheDocument();
		expect(within(desktop).getByText("London, UK")).toBeInTheDocument();
	});
});
