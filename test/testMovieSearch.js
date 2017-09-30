const expect = require('chai').expect;
const nock = require('nock');
const sepia = require('sepia');
const search = require('../movie-search');

describe('sepia', function() {
  this.timeout(5000);

  it('should return 8 titles when searching for <nemo>', function(done) {
    search.queryIMDB('finding nemo').then(function(data) {
      expect(data).to.have.length(8);
      done();
    })
  });

  it('should display message if no search term provided', function() {
    expect(search.queryIMDB('')).to.equal('Please provide a term to search on');
  });

  it('should display message if nothing found', function(done) {
    search.queryIMDB('hgjhgg').then(function(data) {
      expect(data).to.equal('No results found for hgjhgg');
      done();
    })
  });

  const testHtml = `
    <div class = "findSection"> Titles
      <table>
        <tr>
          <td class="result_text">Finding Nemo (2003)</td>
        </tr>
        <tr>
          <td class="result_text">Finding Nemo Again!</td>
        </tr>
        <tr>
          <td class="result_text">Nemo is Back!</td>
        </tr>
      </table>
    </div>
    <div class="findSection">
      <table>
        <tr><td class="result_text">this should not be returned</td></tr>
      </table>
    </div>
  `;

  describe('nock imdb', function() {
    
    it('can find titles with <nemo> on the page', function(done) {
       nock('http://www.imdb.com')
        .get('/find')
        .query({
          ref_: 'nv_sr_fn',
          q: 'Nemo',
          s: 'all'
          })
        .reply(200, testHtml);
      search.queryIMDB('Nemo').then(function(data){
        expect(data).to.have.length(3);
        done();
      })
    });
    
    afterEach(function() {
      nock.restore();
    });
  });


}); //end of function