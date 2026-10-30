import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {installGitHooks as runInstaller} from '../install-git-hooks.mjs';
const installGitHooks = (root, options = {}) => runInstaller(root, {...options, env: {...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1'}});
function fixture(t) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'brain-hooks-'));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const git=args=>spawnSync('git',args,{cwd:root,encoding:'utf8',env:{...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1'}});
 assert.equal(git(['init']).status,0);
 git(['config','user.name','Fixture']);git(['config','user.email','fixture@example.invalid']);
 fs.cpSync(new URL('../githooks/',import.meta.url),path.join(root,'scripts/githooks'),{recursive:true});
 fs.writeFileSync(path.join(root,'package.json'),JSON.stringify({scripts:{test:'node -e "process.exit(0)"',check:'node -e "process.exit(0)"'}}));
 return {root,git};
}
test('optional hooks install idempotently and run during a real Git commit',t=>{
 const {root,git}=fixture(t);
 assert.equal(installGitHooks(root).status,'available');
 assert.equal(installGitHooks(root,{install:true}).status,'installed');
 assert.equal(installGitHooks(root,{install:true}).changed,false);
 git(['add','.']);
 const success=git(['commit','-m','Fixture']);assert.equal(success.status,0,success.stderr);
 fs.writeFileSync(path.join(root,'package.json'),JSON.stringify({scripts:{test:'node -e "process.exit(1)"',check:'node -e "process.exit(0)"'}}));git(['add','.']);
 const failed=git(['commit','-m','Must fail']);assert.notEqual(failed.status,0);
 assert.equal(git(['log','--format=%s','-1']).stdout.trim(),'Fixture');
});
test('installer preserves configured hooks and default custom hooks',t=>{
 const {root,git}=fixture(t);git(['config','core.hooksPath','custom-hooks']);
 assert.equal(installGitHooks(root,{install:true}).status,'preserved');
 assert.equal(git(['config','--get','core.hooksPath']).stdout.trim(),'custom-hooks');
 git(['config','--unset','core.hooksPath']);
 fs.writeFileSync(path.join(root,'.git/hooks/pre-commit'),'#!/bin/sh\nexit 0\n');
 assert.equal(installGitHooks(root,{install:true}).status,'preserved');
 assert.notEqual(git(['config','--get','core.hooksPath']).status,0);
});
test('pre-push executes in actual Git and blocks a failing working-tree check',t=>{
 const {root,git}=fixture(t);
 const remote=fs.mkdtempSync(path.join(os.tmpdir(),'brain-remote-'));
 t.after(()=>fs.rmSync(remote,{recursive:true,force:true}));
 assert.equal(git(['init','--bare',remote]).status,0);
 installGitHooks(root,{install:true});git(['add','.']);assert.equal(git(['commit','-m','Fixture']).status,0);
 git(['remote','add','origin',remote]);assert.equal(git(['push','origin','HEAD']).status,0);
 fs.writeFileSync(path.join(root,'package.json'),JSON.stringify({scripts:{test:'node -e "process.exit(1)"',check:'node -e "process.exit(0)"'}}));
 assert.notEqual(git(['push','origin','HEAD']).status,0);
});
test('configured hook path with missing executable is reported as broken',t=>{
 const {root,git}=fixture(t);git(['config','core.hooksPath','scripts/githooks']);
 fs.rmSync(path.join(root,'scripts/githooks/pre-push'));
 assert.throws(()=>installGitHooks(root),/Missing hook: pre-push/);
});
