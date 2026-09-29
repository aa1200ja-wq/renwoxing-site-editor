import { CraftBridge } from "@/editor/CraftBridge";
import { EditorShell } from "@/editor/EditorShell";
import { sampleProject } from "@/editor/sample-project";

export default function EditorPage() {
  return <CraftBridge><EditorShell initialProject={sampleProject} /></CraftBridge>;
}
