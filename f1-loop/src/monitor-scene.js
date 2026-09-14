/** Dedicated reading scene: one viewport to arrive, four to read, one to leave. */
export function monitorTimeline(y, top, height) {
 const local=Math.max(0,Math.min(1,(y-top)/Math.max(1,height)));
 const reading=Math.max(0,Math.min(1,(local-1/6)/(4/6)));
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 const weight=smooth(local*6)*(1-smooth((local-5/6)*6));
 const story=local<1/6?3.64+.10*smooth(local*6):local>5/6?3.74+.26*smooth((local-5/6)*6):3.74;
 return {local,reading,weight,story,beat:Math.min(2,Math.floor(reading*3)),active:y>=top&&y<top+height};
}
export function monitorMarkup(){return `<section id="analise-no-box" class="monitor-scene" aria-labelledby="monitor-scene-title"><div class="monitor-scene-pin"><div class="monitor-scene-heading"><p>AVALIAR / ANÁLISE NO BOX</p><h2 id="monitor-scene-title">O que o teste permite afirmar?</h2></div><div class="monitor-reading-text"><p>O teste comparou dois formulários, com 50 pedidos por versão: as medianas foram de 12 e 9 minutos.</p><p>O formulário e a equipe mudaram juntos. O teste não isolou a causa da diferença.</p><p>Podemos comunicar a redução observada. Atribuir o ganho ao formulário vai além do que o registro sustenta.</p></div><nav class="monitor-scene-controls" aria-label="Leitura do monitor"><button type="button" data-monitor-prev>← Voltar</button><span id="monitor-page" aria-live="polite">1 / 3 · Observação</span><button type="button" data-monitor-next>Próxima →</button></nav></div></section>`;}
