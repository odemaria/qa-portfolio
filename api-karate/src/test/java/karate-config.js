function fn() {
  // -DbaseUrl=... permite apuntar a otra instancia (por ejemplo, una local en Docker)
  var config = {
    baseUrl: karate.properties['baseUrl'] || 'https://restful-booker.herokuapp.com'
  };
  karate.configure('connectTimeout', 15000);
  karate.configure('readTimeout', 30000);
  return config;
}
