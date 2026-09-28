/* Architect 2.0 interaction depth. All changes here are local prototype state. */
function deepen(p) {
  if (!p) return p;
  let touched = false;
  const defaults = {
    files: { ...codeFiles }, changes: [], queue: [], agents: [{ id:'main', name:'Main agent', role:'Handles the core request', trigger:'User message', memory:'Conversation', framework:p.framework||'LangGraph', model:'Auto · best fit', trace:[] }],
    deployments: [], branch:'main', detected:'React / Vite + TypeScript', sync:'Up to date', problems:[], tests:'Preview scaffold checked', env:'Preview', region:'Auto', selectedAgent:'main'
  };
  for (const [key,value] of Object.entries(defaults)) if (p[key] === undefined) { p[key] = value; touched = true; }
  if (touched) save();
  return p;
}
function activeProject() { return deepen(project()); }
function flowLog(title, detail) { event(title,detail); render(); }
function shortDiff(before,after) {
  const a=String(before).split('\n'), b=String(after).split('\n');
  const removed=a.filter(x=>!b.includes(x)), added=b.filter(x=>!a.includes(x));
  return {added,removed};
}
function flowBadge(label,kind='') { return `<span class="flow-badge ${kind}">${esc(label)}</span>`; }
function flowActions(items){return `<div class="row">${items.map(([text,action,cls])=>`<button class="btn small ${cls||''}" data-action="${action}">${text}</button>`).join('')}</div>`;}
function workspace(){
  const p=activeProject(); if(!p) return home();
  const views=state.mode==='builder'?['preview','queue','agents','playground','data','github','deploy']:['preview','code','changes','queue','agents','playground','data','github','deploy','logs'];
  return `<div class="work"><section class="left-pane"><div class="pane-title"><strong>✧ Architect agent</strong>${flowBadge(state.model)}</div><div class="tabs">${['chat','activity','plan','queue'].map(x=>`<button data-panel="${x}" class="${state.panel===x?'selected':''}">${x[0].toUpperCase()+x.slice(1)}${x==='queue'&&p.queue.length?' · '+p.queue.length:''}</button>`).join('')}</div><div class="stream">${leftContent(p)}</div><div class="chat-compose"><div class="box"><textarea id="chat-input" placeholder="Describe a change. Add several prompts to the queue…"></textarea><footer><button class="chip" data-action="model">${esc(state.model)} ⌄</button><button class="btn primary small" data-action="queue-send">Add to queue ↗</button></footer></div></div></section><section class="canvas"><div class="canvas-bar"><div class="view-tabs">${views.map(v=>`<button class="${state.canvas===v?'selected':''}" data-canvas="${v}">${v==='github'?'Git':v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div><button class="mode-toggle" data-action="flow-mode" aria-label="Switch Builder and Developer mode"><span class="${state.mode==='builder'?'on':''}">Builder</span><span class="${state.mode==='developer'?'on':''}">Developer</span></button></div><div class="canvas-body">${canvasContent(p)}</div></section></div>`;
}
function leftContent(p){
  if(state.panel==='queue') return queueView(p,true);
  if(state.panel==='activity') return `<h3 class="subhead">Build activity</h3><p class="muted">A visible sequence of actions and recovery points.</p>${p.events.slice().reverse().map(e=>`<div class="step"><strong>${esc(e.title)}</strong>${esc(e.detail)}<div class="hint">${esc(e.time)}</div></div>`).join('')}`;
  if(state.panel==='plan') return `<h3 class="subhead">Build plan</h3>${['Understand request','Make checkpoint','Change project files','Run verification','Review diff','Sync branch','Deploy selected version'].map((x,i)=>`<div class="step"><strong>${i<2?'✓':'○'} ${x}</strong><span class="hint">${i<2?'Recorded':'Available as a demo flow'}</span></div>`).join('')}`;
  return `<div class="message assistant"><span class="label">Architect</span>${esc(p.name)} is ready. Add several prompts, inspect the queue, or switch to Developer for precise edits.</div>${p.messages.map(m=>`<div class="message ${m.role}"><span class="label">${m.role==='user'?'You':'Architect'}</span>${esc(m.text)}</div>`).join('')}<div class="card"><h3>Prompt queue</h3><p>${p.queue.filter(x=>x.status==='queued').length} waiting · ${p.queue.filter(x=>x.status==='needs-input').length} needs input</p>${flowActions([['Open queue','open-queue'],['Show clarification','demo-clarification']])}</div>`;
}
function queueView(p,compact=false){
  return `<div class="side-content"><span class="eyebrow">PROMPT QUEUE</span><h2 class="subhead">One request at a time</h2><p class="muted">Add more prompts while one runs. An ambiguous request pauses the queue until you decide.</p>${p.queue.length?p.queue.map((q,i)=>`<div class="card queue-item"><div class="row">${flowBadge(q.status==='needs-input'?'Needs input':q.status==='running'?'Running':q.status==='done'?'Completed':'Queued',q.status)}<span class="hint">#${i+1}</span></div><h3>${esc(q.text)}</h3>${q.status==='needs-input'?`<p>Should sign-in use email/password or Google? This changes authentication and setup.</p>${flowActions([['Email/password','clarify-email'],['Google','clarify-google']])}<input type="hidden" id="clarification-id" value="${q.id}">`:''}${q.status==='queued'?`<button class="btn small" data-action="remove-queue" data-id="${q.id}">Remove</button>`:''}${q.status==='done'?'<p>Suggested file change is available in Changes.</p>':''}</div>`).join(''):`<div class="empty">No prompts queued. Add a request in the chat, or try an ambiguity example.</div>`}${!compact?flowActions([['Demo clarification','demo-clarification']]):''}</div>`;
}
function code(){
  const p=activeProject(), file=state.selectedFile in p.files?state.selectedFile:Object.keys(p.files)[0];
  state.selectedFile=file;
  return `<div class="editor-shell"><div class="editor-toolbar"><div><span class="eyebrow">DEVELOPER WORKSPACE</span><h2 class="subhead">Edit the scaffold</h2><span class="hint">Changes are saved locally, then reviewed before Apply.</span></div><button class="btn" data-action="open-changes">Review changes · ${p.changes.filter(x=>x.status==='pending').length}</button></div><div class="code-wrap"><div class="files"><div class="hint">PROJECT FILES</div>${Object.keys(p.files).map(f=>`<button class="${file===f?'selected':''}" data-file="${f}">▤ ${esc(f)}</button>`).join('')}</div><div class="code-area"><div class="filename">${esc(file)} · editable demo scaffold</div><textarea class="editor" id="file-editor" spellcheck="false" aria-label="Edit ${esc(file)}">${esc(p.files[file])}</textarea><div class="row"><button class="btn primary small" data-action="save-file">Save draft</button><button class="btn small" data-action="open-changes">See diff</button></div></div></div></div>`;
}
function changesView(p){
  const pending=p.changes.filter(c=>c.status==='pending');
  return `<div class="side-content"><span class="eyebrow">REVIEW & VERIFY</span><h2 class="subhead">Changes</h2><p class="muted">Inspect every affected file before applying or reverting a draft. Verification is illustrative in this prototype.</p><div class="verification-grid"><div class="card"><h3>Affected files</h3><strong>${pending.length}</strong></div><div class="card"><h3>Tests</h3><strong>${esc(p.tests)}</strong></div><div class="card"><h3>Problems</h3><strong>${p.problems.length}</strong></div></div><div class="row review-controls"><button class="btn small" data-action="run-verification">Run demo checks</button><button class="btn small" data-action="demo-problem">Show failing check</button>${p.problems.length?'<button class="btn small" data-action="clear-problem">Resolve problem</button>':''}</div>${p.problems.length?`<div class="card problem"><h3>Problems to review</h3>${p.problems.map(x=>`<p>${esc(x)}</p>`).join('')}</div>`:''}${pending.length?pending.slice().reverse().map(c=>{const d=shortDiff(c.before,c.after);return `<div class="card change-card"><div class="row">${flowBadge(c.origin||'Manual edit')}<strong>${esc(c.file)}</strong><span class="hint">+${d.added.length} / −${d.removed.length}</span></div><div class="diff">${d.removed.map(x=>`<div class="minus">− ${esc(x)}</div>`).join('')}${d.added.map(x=>`<div class="plus">+ ${esc(x)}</div>`).join('')||'<div>No changed lines</div>'}</div>${flowActions([['Apply','apply-change','primary'],['Revert','revert-change']])}<input type="hidden" class="change-id" value="${c.id}"></div>`}).join(''):`<div class="empty">No pending changes. Edit a file in Developer mode or complete a queued prompt.</div>`}${p.changes.some(c=>c.status!=='pending')?`<div class="card"><h3>Review history</h3>${p.changes.filter(c=>c.status!=='pending').slice().reverse().map(c=>`<p>${esc(c.file)} · ${esc(c.status)}</p>`).join('')}</div>`:''}<div class="card"><h3>Verification steps</h3><p>✓ Syntax review (demo) · ✓ Preview scaffold available · ○ Production tests require a sandbox.</p></div></div>`;
}
function agents(p){
  const current=p.agents.find(a=>a.id===p.selectedAgent)||p.agents[0];
  return `<div class="side-content"><span class="eyebrow">AGENT STUDIO</span><h2 class="subhead">Agents and orchestration</h2><p class="muted">Choose an agent to inspect triggers, memory, model and execution trace.</p><div class="row">${p.agents.map(a=>`<button class="chip ${a.id===current.id?'active':''}" data-action="select-agent" data-id="${a.id}">✧ ${esc(a.name)}</button>`).join('')}<button class="btn small primary" data-action="create-agent">+ New agent</button></div><div class="card"><h3>${esc(current.name)}</h3><p>${esc(current.role)}</p><div class="two"><label class="field"><span>Trigger</span><select id="agent-trigger">${['User message','Scheduled','Webhook','Another agent'].map(x=>`<option ${x===current.trigger?'selected':''}>${x}</option>`).join('')}</select></label><label class="field"><span>Memory</span><select id="agent-memory">${['None','Conversation','Project knowledge','Long-term'].map(x=>`<option ${x===current.memory?'selected':''}>${x}</option>`).join('')}</select></label><label class="field"><span>Framework</span><select id="agent-framework">${['LangGraph','CrewAI','AutoGen','OpenAI Agents SDK','Custom'].map(x=>`<option ${x===current.framework?'selected':''}>${x}</option>`).join('')}</select></label><label class="field"><span>Model</span><select id="agent-model">${['Auto · best fit','GPT family','Claude family','Gemini family','Open-source model'].map(x=>`<option ${x===current.model?'selected':''}>${x}</option>`).join('')}</select></label></div>${flowActions([['Save agent','depth-save-agent','primary'],['Open playground','open-playground']])}</div><div class="card"><h3>Tools and guardrails</h3><p>Knowledge search · Scoped service connections · Approval before external actions</p><button class="btn small" data-action="tools">+ Add tool</button></div><div class="card"><h3>Recent execution trace</h3>${current.trace.length?current.trace.slice().reverse().map(t=>`<p><strong>${esc(t.step)}</strong> · ${esc(t.detail)}</p>`).join(''):'<p>No test run yet. Open Playground to see a trace.</p>'}</div></div>`;
}
function playground(p){
  const a=p.agents.find(x=>x.id===p.selectedAgent)||p.agents[0];
  return `<div class="side-content"><span class="eyebrow">AGENT PLAYGROUND</span><h2 class="subhead">Test ${esc(a.name)}</h2><p class="muted">Try an input and inspect the simulated execution trace before releasing the agent.</p><label class="field"><span>Test input</span><textarea class="large-input" id="playground-input" placeholder="Summarize the latest customer request and recommend a next step."></textarea></label><button class="btn primary" data-action="run-playground">Run test →</button>${p.lastTest?`<div class="card"><h3>Sample response</h3><p>${esc(p.lastTest.output)}</p><div class="trace">${p.lastTest.trace.map((x,i)=>`<div><strong>0${i+1} ${esc(x.step)}</strong><span>${esc(x.detail)}</span></div>`).join('')}</div></div>`:''}</div>`;
}
function git(p){
  return `<div class="side-content"><span class="eyebrow">SOURCE CONTROL</span><h2 class="subhead">GitHub sync</h2><p class="muted">Keep the selected branch and detected framework visible from import through review.</p><div class="card"><h3>${p.github?esc(p.repo||'Connected repository'):'No repository connected'}</h3><p>Selected branch: <strong>${esc(p.branch)}</strong> · Detected stack: <strong>${esc(p.detected)}</strong></p>${flowBadge(p.sync,p.sync==='Conflict'?'needs-input':'')}<div class="row" style="margin-top:14px"><button class="btn small" data-action="connect-github">${p.github?'Change repository':'Connect GitHub'}</button><button class="btn small" data-action="sync-git">Sync branch</button><button class="btn small" data-action="simulate-conflict">Demo conflict</button></div></div>${p.sync==='Conflict'?`<div class="card problem"><h3>Conflict in src/App.tsx</h3><p>Both Architect and the remote branch changed this file. Choose a version before syncing.</p>${flowActions([['Keep Architect changes','resolve-local'],['Use remote version','resolve-remote']])}</div>`:''}<div class="card"><h3>Working branch</h3><p><code>architect/${esc(p.slug)}</code> · ${p.changes.filter(x=>x.status==='applied').length} applied changes</p>${flowActions([['Review diff','open-changes'],['Push branch','push'],['Open PR','pr']])}</div><p class="hint">GitHub connection, sync and conflicts are interactive demo states; no remote repository is changed.</p></div>`;
}
function deploy(p){
  return `<div class="side-content"><span class="eyebrow">RELEASE CENTER</span><h2 class="subhead">Deployments</h2><p class="muted">Configure an environment, choose a region, inspect build logs and keep a release history.</p><div class="two"><label class="field"><span>Environment</span><select id="deployment-env">${['Preview','Staging','Production'].map(x=>`<option ${x===p.env?'selected':''}>${x}</option>`).join('')}</select></label><label class="field"><span>Region</span><select id="deployment-region">${['Auto','US East','Europe West','Asia Pacific'].map(x=>`<option ${x===p.region?'selected':''}>${x}</option>`).join('')}</select></label></div>${flowActions([['Save settings','save-deploy-settings'],['Create demo release','deploy-modal','primary']])}<div class="card"><h3>Build logs</h3><pre class="build-log">${esc(p.deployments[0]?.logs?.join('\n')||'$ Waiting for a release\nSelect an environment and create a demo deployment.')}</pre></div><h3 class="subhead">Release history</h3>${p.deployments.length?p.deployments.map((d,i)=>`<div class="card release"><div class="row">${flowBadge(d.status,d.status==='Rolled back'?'needs-input':'')}<strong>${esc(d.env)} · v${d.version}</strong><span class="hint">${esc(d.region)} · ${esc(d.time)}</span></div><p>Source checkpoint: ${esc(d.checkpoint)} · ${esc(d.url)}</p>${flowActions([[d.env==='Production'?'Promote again':'Promote to production','promote-release'],['Rollback to this','rollback-release']])}<input type="hidden" class="release-id" value="${d.id}"></div>`).join(''):`<div class="empty">No releases yet. Create a demo release to see logs and history.</div>`}<p class="hint">These are simulated generated-app releases; the Architect prototype site is deployed separately.</p></div>`;
}
function logs(p){return `<div class="side-content"><span class="eyebrow">DEVELOPER CONTROLS</span><h2 class="subhead">Runs and recovery</h2><div class="card"><h3>Verification</h3><p>${esc(p.tests)} · ${p.problems.length} problems</p><button class="btn small" data-action="open-changes">Review affected files</button></div><div class="card"><h3>Checkpoint 01 · Initial project</h3><p>Return to the starter state. Current drafts and queued prompts will be cleared.</p><button class="btn small" data-action="depth-restore">Restore checkpoint</button></div></div>`;}
function canvasContent(p){return ({preview:()=>preview(p),code,changes:()=>changesView(p),queue:()=>queueView(p),agents:()=>agents(p),playground:()=>playground(p),data:()=>data(p),github:()=>git(p),deploy:()=>deploy(p),logs:()=>logs(p)})[state.canvas]?.()||preview(p)}
function modal(){
  const p=activeProject();
  if(state.modal==='import')return modalShell('Import an existing project','Choose a repository, branch and detected stack to continue in Architect.',`<label class="field"><span>GitHub repository URL</span><input id="repo-url" placeholder="https://github.com/owner/repository"></label><div class="two"><label class="field"><span>Branch</span><input id="repo-branch" value="main"></label><label class="field"><span>Detected framework (demo)</span><select id="detected-stack"><option>React / Vite + TypeScript</option><option>Next.js + TypeScript</option><option>FastAPI + Python</option><option>NestJS + TypeScript</option><option>Custom stack</option></select></label></div><p>The import is a local demo project. A production import would clone and inspect an authorized repository inside a sandbox.</p>`,'Import demo project','depth-import');
  if(state.modal==='deploy')return modalShell('Create a demo release','Pin a checkpoint and configure the target.',`<div class="two"><label class="field"><span>Environment</span><select id="modal-env">${['Preview','Staging','Production'].map(x=>`<option ${x===p?.env?'selected':''}>${x}</option>`).join('')}</select></label><label class="field"><span>Region</span><select id="modal-region">${['Auto','US East','Europe West','Asia Pacific'].map(x=>`<option ${x===p?.region?'selected':''}>${x}</option>`).join('')}</select></label></div><label class="field"><span>Subdomain</span><input id="deploy-slug" value="${esc(p?.slug||'my-app')}"></label><p>The release, URL and logs shown afterward are simulated. No generated app is deployed.</p>`,'Create demo release','depth-deploy');
  if(state.modal==='new-agent')return modalShell('Create an agent','Define a role and how it starts.',`<label class="field"><span>Agent name</span><input id="new-agent-name" placeholder="Research agent"></label><label class="field"><span>Role</span><input id="new-agent-role" placeholder="Researches and verifies sources"></label><label class="field"><span>Trigger</span><select id="new-agent-trigger"><option>User message</option><option>Scheduled</option><option>Webhook</option><option>Another agent</option></select></label>`,'Create agent','confirm-new-agent');
  return extraModal();
}

function extraModal(){
  if(state.modal==='github')return modalShell('Connect GitHub','Choose a repository and keep its branch in this demo.',`<label class="field"><span>Repository</span><input id="github-repo" placeholder="owner/repository"></label><label class="field"><span>Branch</span><input id="github-branch" value="${esc(activeProject()?.branch||'main')}"></label><p>No GitHub credentials or remote files are accessed.</p>`,'Connect demo repository','depth-github');
  if(state.modal==='model')return modalShell('Choose a model','Set the preference for future agent runs.',`<label class="field"><span>Model</span><select id="model-select">${['Auto · best fit','GPT family','Claude family','Gemini family','Open-source model'].map(x=>`<option ${state.model===x?'selected':''}>${x}</option>`).join('')}</select></label>`,'Save','depth-model');
  if(state.modal==='framework')return modalShell('Agent framework','Choose how agent logic would be scaffolded.',`<label class="field"><span>Framework</span><select id="framework-select"><option>Auto-detect</option><option>LangGraph</option><option>CrewAI</option><option>AutoGen</option><option>OpenAI Agents SDK</option><option>Custom</option></select></label>`,'Save','depth-framework');
  if(state.modal==='tools')return modalShell('Add a tool','Review the intended agent capability.',`<div class="card"><h3>Knowledge search</h3><p>Retrieve relevant context before answering. Credentials are never entered in this prototype.</p></div>`,'Add demo tool','depth-tool');
  if(state.modal==='share')return modalShell('Share workspace','Invitations are previewed but not sent.',`<label class="field"><span>Email</span><input id="share-email" type="email" placeholder="teammate@example.com"></label><label class="field"><span>Role</span><select id="share-role"><option>Builder</option><option>Developer</option><option>Viewer</option></select></label>`,'Preview invitation','depth-share');
  return '';
}
function processQueue(){
  const p=activeProject(); if(!p || p.queue.some(q=>q.status==='running'||q.status==='needs-input'))return;
  const next=p.queue.find(q=>q.status==='queued');if(!next)return;
  next.status='running';event('Prompt started',next.text);save();render();
  setTimeout(()=>{
    const current=project();if(!current)return;
    const q=current.queue.find(x=>x.id===next.id);if(!q||q.status!=='running')return;
    if(q.forceClarification||(!q.resolved&&/\b(add login|add sign in|add authentication)\b/i.test(q.text))){
      q.status='needs-input';current.messages.push({role:'assistant',text:'I need one decision before changing authentication: email/password or Google sign-in? The queue is paused until you choose.'});event('Needs input','Authentication method affects implementation and credentials.');save();render();return;
    }
    completeQueuedPrompt(current,q);processQueue();
  },900);
}
function completeQueuedPrompt(p,q){
  q.status='done';
  const file='src/App.tsx',before=p.files[file]||'',after=before+`\n// Planned demo change: ${q.text.replace(/[\r\n]+/g,' ').slice(0,100)}`;
  p.files[file]=after;
  p.changes.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),file,before,after,status:'pending',origin:'Queued prompt'});
  p.tests='Suggested change reviewed (demo)';p.messages.push({role:'assistant',text:`Completed the demo step for “${q.text}”. A suggested change is ready in Changes. No sandbox command ran.`});
  event('Prompt completed',q.text);save();render();
}
function addQueue(text,forceClarification=false){
  const p=activeProject();if(!p||!text)return;
  p.queue.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),text,status:'queued',forceClarification});
  p.messages.push({role:'user',text});event('Prompt queued',text);save();set({panel:'queue',canvas:'queue'});processQueue();
}
const depthActions=new Set(['queue-send','demo-clarification','clarify-email','clarify-google','remove-queue','open-queue','save-file','open-changes','apply-change','revert-change','run-verification','demo-problem','clear-problem','create-agent','confirm-new-agent','select-agent','depth-save-agent','open-playground','run-playground','depth-import','depth-github','sync-git','simulate-conflict','resolve-local','resolve-remote','save-deploy-settings','depth-deploy','promote-release','rollback-release','depth-restore','flow-mode','depth-model','depth-framework','depth-tool','depth-share']);
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-action]');if(!t||!depthActions.has(t.dataset.action))return;
  e.preventDefault();e.stopImmediatePropagation();
  const a=t.dataset.action,p=activeProject(),v=id=>$(id)?.value?.trim()||'';
  const done=msg=>{save();render();notice(msg)};
  switch(a){
    case'queue-send':{const text=v('#chat-input');if(!text){notice('Write a request first');break}addQueue(text);break}
    case'demo-clarification':addQueue('Add login to the app',true);break;
    case'open-queue':set({panel:'queue',canvas:'queue'});break;
    case'clarify-email':case'clarify-google':{
      const id=t.closest('.queue-item')?.querySelector('.change-id,#clarification-id')?.value;
      const q=p.queue.find(x=>x.id===id);if(!q)break;
      q.text+=a==='clarify-email'?' · use email/password':' · use Google';q.status='queued';q.forceClarification=false;q.resolved=true;
      p.messages.push({role:'user',text:a==='clarify-email'?'Use email and password.':'Use Google sign-in.'});
      event('Clarification resolved',q.text);done('Queue resumed');processQueue();break;
    }
    case'remove-queue':p.queue=p.queue.filter(x=>x.id!==t.dataset.id);done('Queued prompt removed');break;
    case'save-file':{
      const file=state.selectedFile,before=p.files[file],after=$('#file-editor')?.value??before;
      if(after===before){notice('No edits to save');break}
      p.files[file]=after;p.changes.push({id:Date.now().toString(36),file,before,after,status:'pending',origin:'Manual edit'});
      p.tests='Draft saved · checks pending';event('Developer edit saved',file);set({canvas:'changes'});notice('Draft saved · review the diff');break;
    }
    case'open-changes':set({canvas:'changes',mode:'developer'});break;
    case'apply-change':case'revert-change':{
      const id=t.closest('.change-card')?.querySelector('.change-id')?.value,c=p.changes.find(x=>x.id===id);if(!c)break;
      if(a==='revert-change'){p.files[c.file]=c.before;c.status='reverted'}else c.status='applied';
      p.tests=a==='apply-change'?'Demo verification passed':'Reverted to previous draft';event(a==='apply-change'?'Change applied':'Change reverted',c.file);done(a==='apply-change'?'Change applied locally':'Change reverted');break;
    }
    case'run-verification':p.tests=p.problems.length?'1 check failed (demo)':'3 checks passed (demo)';event('Verification completed',p.tests);done('Demo checks completed');break;
    case'demo-problem':p.problems=['src/App.tsx: Missing required environment variable (sample error)'];p.tests='1 check failed (demo)';event('Verification problem found',p.problems[0]);done('Sample problem added');break;
    case'clear-problem':p.problems=[];p.tests='3 checks passed (demo)';event('Problem resolved','Sample check passed');done('Sample problem resolved');break;
    case'create-agent':set({modal:'new-agent'});break;
    case'confirm-new-agent':{
      const name=v('#new-agent-name');if(!name){notice('Name the agent first');break}
      const id=Date.now().toString(36);p.agents.push({id,name,role:v('#new-agent-role')||'Specialist agent',trigger:v('#new-agent-trigger'),memory:'Conversation',framework:p.framework,model:state.model,trace:[]});
      p.selectedAgent=id;state.modal=null;event('Agent created',name);done('Demo agent added');break;
    }
    case'select-agent':p.selectedAgent=t.dataset.id;done('Agent selected');break;
    case'depth-save-agent':{
      const ag=p.agents.find(x=>x.id===p.selectedAgent);if(!ag)break;
      Object.assign(ag,{trigger:v('#agent-trigger'),memory:v('#agent-memory'),framework:v('#agent-framework'),model:v('#agent-model')});
      event('Agent configuration saved',ag.name);done('Agent settings saved');break;
    }
    case'open-playground':set({canvas:'playground'});break;
    case'run-playground':{
      const input=v('#playground-input');if(!input){notice('Enter a test input');break}
      const ag=p.agents.find(x=>x.id===p.selectedAgent)||p.agents[0];
      const trace=[{step:'Trigger',detail:ag.trigger},{step:'Context',detail:ag.memory+' memory selected'},{step:'Model',detail:ag.model+' · response simulated'},{step:'Review',detail:'No external tool called'}];
      ag.trace=trace;p.lastTest={input,output:`Sample response for “${input.slice(0,110)}”: I would gather the relevant context, then return a clear answer with a review step.`,trace};
      event('Playground run',ag.name);done('Demo trace ready');break;
    }
    case'depth-import':{
      const repo=v('#repo-url'),branch=v('#repo-branch');if(!/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(repo)||!branch){notice('Enter a repository URL and branch');break}
      const detected=v('#detected-stack');createFromPrompt('', 'Auto-detect',repo);const imported=activeProject();Object.assign(imported,{branch,detected,sync:'Imported snapshot',repo,github:true});
      state.modal=null;event('Repository imported',`${repo} · ${branch} · ${detected}`);done('Demo import ready');break;
    }
    case'depth-github':{
      const repo=v('#github-repo'),branch=v('#github-branch');if(!/^[^/\s]+\/[^/\s]+$/.test(repo)||!branch){notice('Enter owner/repository and branch');break}
      Object.assign(p,{repo,branch,github:true,sync:'Up to date'});state.modal=null;event('Repository connected',repo+' · '+branch);done('Demo repository connected');break;
    }
    case'sync-git':if(!p.github){notice('Connect a repository first');break}if(p.sync==='Conflict'){notice('Resolve the conflict first');break}p.sync='Up to date';event('Branch synchronized',p.branch);done('Demo branch synchronized');break;
    case'simulate-conflict':if(!p.github){notice('Connect a repository first');break}p.sync='Conflict';event('Sync conflict','src/App.tsx changed in both places');done('Conflict needs a decision');break;
    case'resolve-local':case'resolve-remote':p.sync=a==='resolve-local'?'Architect version selected':'Remote version selected';event('Conflict resolved',p.sync);done('Conflict resolved · ready to sync');break;
    case'save-deploy-settings':p.env=v('#deployment-env');p.region=v('#deployment-region');done('Release settings saved');break;
    case'depth-deploy':{
      const slug=v('#deploy-slug').toLowerCase().replace(/[^a-z0-9-]/g,'-');if(!slug){notice('Enter a subdomain');break}
      p.slug=slug;p.env=v('#modal-env');p.region=v('#modal-region');const version=p.deployments.length+1;
      const d={id:Date.now().toString(36),version,env:p.env,region:p.region,status:p.env==='Production'?'Live':'Ready',checkpoint:'current project',url:`https://${slug}-v${version}.architect-demo.app`,time:new Date().toLocaleString(),logs:['$ Preparing immutable source snapshot','✓ Installing dependencies (simulated)','$ Building application','✓ Build completed (simulated)','$ Running health check','✓ Demo release ready']};
      p.deployments.unshift(d);if(p.env==='Production')p.status='Published';state.modal=null;state.canvas='deploy';event('Demo release created',`${p.env} v${version}`);done('Release added to history · no generated app deployed');break;
    }
    case'promote-release':case'rollback-release':{
      const id=t.closest('.release')?.querySelector('.release-id')?.value,d=p.deployments.find(x=>x.id===id);if(!d)break;
      const prior=p.deployments.find(x=>x.env==='Production'&&x.status==='Live');if(prior)prior.status='Superseded';
      const version=p.deployments.length+1;
      p.deployments.unshift({...d,id:Date.now().toString(36),version,env:'Production',status:'Live',time:new Date().toLocaleString(),logs:[`$ ${a==='promote-release'?'Promoting':'Rolling back to'} v${d.version}`,'✓ Target version pinned (simulated)','✓ Production alias updated (simulated)']});
      p.status='Published';event(a==='promote-release'?'Version promoted':'Rollback completed',`v${d.version} → production`);done(a==='promote-release'?'Demo version promoted':'Demo rollback recorded');break;
    }
    case'depth-restore':p.messages=[];p.queue=[];p.changes=[];p.files={...codeFiles};p.status='In progress';event('Checkpoint restored','Initial scaffold restored');done('Initial checkpoint restored');break;
    case'flow-mode':set({mode:state.mode==='builder'?'developer':'builder'});break;
    case'depth-model':set({model:v('#model-select'),modal:null});break;
    case'depth-framework':set({framework:v('#framework-select'),modal:null});break;
    case'depth-tool':state.modal=null;event('Tool added','Knowledge search · demo capability');done('Demo tool added');break;
    case'depth-share':state.modal=null;notice('Invitation previewed · no email sent');break;
  }
},true);
for(const p of state.projects){deepen(p);for(const q of p.queue)if(q.status==='running')q.status='queued'}
save();render();if(project())processQueue();
