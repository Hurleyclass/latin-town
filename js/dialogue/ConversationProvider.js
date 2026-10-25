export class ConversationProvider {
  async respond({ npcId, playerText, history }) { throw new Error('Implement respond'); }
}
export class ScriptedProvider extends ConversationProvider {
  constructor(data) { super(); this.data = data; }
  async respond({ npcId, playerText = '', history = [] }) {
    const line = this.data.lines.find(l => l.id === playerText && l.speaker === npcId)
      || this.data.lines.find(l => l.id === this.data.tap[npcId]);
    return line ? { text: line.text, audioUrl: line.audio, line } : { text: 'Salve!', audioUrl: 'audio/salve.mp3' };
  }
}
// Implement a server endpoint here to use an LLM. Keep credentials on the server.
// Sanitize responses to Latin, generate speech server-side, and return {text, audioUrl}.
export class LLMProvider extends ConversationProvider {
  async respond({ npcId, playerText, history }) { throw new Error('LLMProvider nondum paratus est.'); }
}
