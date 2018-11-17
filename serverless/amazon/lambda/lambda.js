// [x] zip with:
// zip -r echoLambda.zip ./serverless/amazon/lambda/lambda.js ./public_html

const DEBUG_LOCAL = false;
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

const executableFile = './echo.bin';

const spawn = require('child_process').spawn;
var fs = require('fs');
var readline = require('readline');
var env = Object.create(process.env);

exports.handler = function (event, context, callback) {
  let headers = event['headers'] == undefined ? '' : event['headers'];
  let queryStrings = event['queryStringParameters'] == undefined ? '' : generateQueryString(event['queryStringParameters']);
  let environment = {
    'method': event['httpMethod'] == undefined ? 'function' : event['httpMethod'],
    'header': headers,
    'queryStrings': queryStrings,
  }
  if (event['httpMethod'] != undefined) {
    environment['path'] = event['requestContext']['path'];
    environment['resourcePath'] = event['requestContext']['resourcePath'];
    environment['requestId'] = event['requestContext']['requestId'];
    environment['apiId'] = event['requestContext']['apiId'];
    if (event['body'] != null) {
      if (isJson(event['body'])) {
        environment['body'] = JSON.parse(event['body']);
      } else {
        environment['body'] = event['body'];
      }

    } else {
      environment['body'] = {};
    }
  } else {
    environment['body'] = event;
  }
  //console.log('===================== ENV');
  //console.log(environment);

  // response variable
  var response = {
    "statusCode": 200,
    "headers": {
      "my_header": "my_value"
    },
    "body": '',
    "isBase64Encoded": false
  };

  //var CMD = "echo -n 'a=b;c=d' | REQUEST_METHOD=POST CONTENT_LENGTH=7 QUERY_STRING=limit=20 ./echo.bin";

  
  //env.REQUEST_METHOD = 'POST';
  env.REQUEST_METHOD = environment['method'] == 'function' ? 'POST' : environment['method'];
  env.QUERY_STRING = environment['queryStrings'];
  env.CONTENT_LENGTH = env.QUERY_STRING.length;
  env.GATEWAY_INTERFACE = "'CGI/1.1'";
  var output = "";
  var child = spawn(executableFile, ['sesuatu'], { env: env });
  child.stdin.write((JSON.stringify(environment['body'])));
  child.stdin.end();
  child.stdout.on('data', function (data) {
    output += data;
  });
  child.stderr.on('data', function (data) {
    console.log("-- STDERR: " + data);
  });
  child.on('close', function (code) {
    var outputScanned = scanOutput(output);
    response['headers'] = outputScanned['headers'];
    
    //response['body'] = JSON.stringify(event);
    response['body'] = outputScanned['body'];

    callback(null, response);
  });


}

function generateQueryString(AQueryString) {
  var s = '';
  for (var item in AQueryString) {
    s += item + '=' + AQueryString[item] + '&';
  }
  s = s.substring(0, s.length - 1);
  return s;
}

function scanOutput(AOutput) {
  var outputHeaders = {
    'Status': 'OK'
  }
  var outputBody = '';
  var lines = AOutput.split('\n');
  var checkHeader = true;
  lines.forEach(function (line) {
    if (line === '') {
      checkHeader = false;
      return false;
    }
    if (checkHeader) {
      var h = line.split(':');
      var v = h[1].trim();
      if (isNumeric(v)) {
        v = parseInt(v);
      }
      outputHeaders[h[0]] = v;
    } else {
      outputBody += '\n' + line;
    }
  })
  outputBody = outputBody.trim();

  var output = {
    'headers': outputHeaders,
    'body': outputBody
  }
  return output;
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function isNumeric(s) {
  //return (typeof s == "number" && !isNaN(s));
  var n = parseInt(s);
  if (s == n) {
    return true;
  }
}

function CallbackFunction(par1, AResponse) {
  console.log(AResponse);
}

//local debug only
if (DEBUG_LOCAL) {
  var s = fs.readFileSync('template/post.json', { encoding: 'utf8' });
  exports.handler(JSON.parse(s), '', CallbackFunction); //exports.handler(JSON.parse('{"hello":"world"}'), '', CallbackFunction);
}

