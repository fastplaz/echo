cd ../../../public_html/
rm -rf echoLambda.zip
cp ../serverless/amazon/lambda/lambda.js .
zip -r echoLambda.zip lambda.js echo.bin ./config/ ./ztemp/
rm -rf lambda.js
mv echoLambda.zip ../serverless/amazon/lambda/