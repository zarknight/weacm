var path = require('path'), 
	  spawn = require('child_process').spawn;

function start() {
	var app_path = path.resolve(__dirname, 'app.js');
	var child = spawn(process.execPath, [ app_path ]);
	
	process.stderr.write('started child with pid: ' + child.pid + '\n');

	child.on('exit', function(code) {
		process.stderr.write('child exit: ' + code + '!\n');
		setTimeout(start, 100);
	});
	
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
}

start();
