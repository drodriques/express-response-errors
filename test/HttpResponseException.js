// HttpResponseException
import { HttpResponseException, HTTP_I_AM_A_TEAPOT, STATUS_TEXTS } from '..'


describe('HttpResponseException', () => {
  it('should throw error', function(done) {
    // status, message, type
    try {
      throw new HttpResponseException(HTTP_I_AM_A_TEAPOT)
    } catch(err) {
      err.message.should.equal(STATUS_TEXTS[HTTP_I_AM_A_TEAPOT]);
      err.status.should.equal(HTTP_I_AM_A_TEAPOT);
    }
  })

})



