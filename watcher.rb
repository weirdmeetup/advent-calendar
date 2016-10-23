loop do
  `./node_modules/.bin/babel src -d js`
  sleep 1
end
