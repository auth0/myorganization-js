import { SDK_VERSION } from "../../../src/version.js";
import { generateClientInfo } from "../../../src/utils/clientInfo.js";

// We can use vi.fn() to create a dynamic mock that we control
const mockRuntime = { type: "node", version: "18.17.0" };

vi.mock("../../../src/core/runtime/index.js", () => ({
    get RUNTIME() {
        return mockRuntime;
    },
}));

describe("Client Info", () => {
    describe("generateClientInfo", () => {
        it("should generate client info with SDK version (node runtime)", () => {
            Object.assign(mockRuntime, { type: "node", version: "18.17.0" });

            const clientInfo = generateClientInfo();
            expect(clientInfo.name).toBe("myorganization-js");
            expect(clientInfo.version).toBe(SDK_VERSION);
            expect(clientInfo.env!["node"]).toBe("18.17.0");
        });

        it("should handle cloudflare workers runtime type", () => {
            Object.assign(mockRuntime, { type: "workerd", version: "2023.8.0" });

            const clientInfo = generateClientInfo();
            expect(clientInfo.env!["cloudflare-workers"]).toBe("2023.8.0");
        });

        it("should handle browser runtime type", () => {
            Object.assign(mockRuntime, { type: "browser", version: "unknown" });

            const clientInfo = generateClientInfo();
            expect(clientInfo.env!["browser"]).toBe("unknown");
        });

        it("should handle unknown runtime", () => {
            Object.assign(mockRuntime, { type: null, version: null });

            const clientInfo = generateClientInfo();
            expect(clientInfo.env!["unknown"]).toBe("unknown");
        });

        it("should handle deno runtime type", () => {
            Object.assign(mockRuntime, { type: "deno", version: "1.36.0" });

            const clientInfo = generateClientInfo();
            expect(clientInfo.env!["deno"]).toBe("1.36.0");
        });

        it("should maintain proper structure", () => {
            Object.assign(mockRuntime, { type: "node", version: "18.17.0" });

            const clientInfo = generateClientInfo();
            expect(clientInfo).toMatchObject({
                name: expect.any(String),
                version: expect.any(String),
                env: expect.any(Object),
            });
            expect(Object.keys(clientInfo.env!)).toHaveLength(1);
        });
    });
});
