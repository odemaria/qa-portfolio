function() {
  // nombre unico por ejecucion: la API es publica y compartida
  var suffix = java.util.UUID.randomUUID().toString().substring(0, 8);
  return {
    firstname: 'QA-' + suffix,
    lastname: 'Portfolio',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
    additionalneeds: 'Breakfast'
  };
}
