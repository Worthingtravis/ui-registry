import { TerminalChrome } from "@/registry/terminal-chrome";

export default function TerminalChromeDemo() {
  return (
    <TerminalChrome title="~/projects/ui-registry">
      <div className="space-y-1 text-zinc-300">
        <p><span className="text-green-400">$</span> pnpm build</p>
        <p className="text-zinc-500">Building registry...</p>
        <p className="text-green-400">Done in 1.2s</p>
      </div>
    </TerminalChrome>
  );
}
