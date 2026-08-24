const SHEET_NAME = 'Bookings'
const SECRET_TOKEN = 'nU1U7o83CqGzgVeZO0YIKWS7C8YNprqgvUV3VePBa6k'

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}')
    if (body.token !== SECRET_TOKEN) return response({ success: false, message: 'Unauthorized' })

    const booking = body.booking || {}
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME)

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Booking ID', 'Received', 'Pickup', 'Drop-off', 'Passengers', 'Luggage',
        'Date and time', 'Vehicle', 'Customer', 'Phone', 'Email', 'Message', 'Status'
      ])
    }

    sheet.appendRow([
      booking.id || '', new Date(), booking.pickup_location || '', booking.dropoff_location || '',
      booking.passengers || '', booking.luggage || '', booking.datetime || '', booking.vehicle || booking.vehicle_id || '',
      booking.customer_name || '', booking.phone || '', booking.email || '', booking.message || '', booking.status || 'pending'
    ])

    return response({ success: true })
  } catch (error) {
    return response({ success: false, message: error.message })
  }
}

function response(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)
}
