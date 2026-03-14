import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Navbar } from "@/components/layout/navbar";

describe("Navbar", () => {
  it("renders platform name", () => {
    render(<Navbar />);
    expect(screen.getByText("DSA Suite")).toBeTruthy();
  });
});
