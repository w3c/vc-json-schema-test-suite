describe('Matrix Test', function() {
    // summaries are displayed in the SOTD section after the results
    const summaries = new Set();
    this.summary = summaries;
    // when the report sees a suite with report true it includes it
    this.report = true;
    // this tells the reporter to use the matrix.hbs template to display the results
    this.matrix = true;
    // this gives the names of the implementations that are being tested
    this.implemented = ['foo'];
    // this gives the names of the implementations that are not being tested
    this.notImplemented = ['bar'];
    // this will give the row label in the matrix
    this.rowLabel = 'Row';
    // this is the column label in the matrix
    this.columnLabel = 'Verifier';
    //this is an array with items in the form {data: 'foo', detail: false, label: 'bar'}
    const reportData = [];
    // reportData is displayed as code examples
    this.reportData = reportData;
    // this is an array with items in the form {src: 'foo', meta: ['bar']}
    // the images will be displayed with the meta under them
    const images = [];
    this.images = images;
    it('should be a cell in the matrix', function() {
        // this tells the reporter which column and row the test result
        // should be placed in
        this.test.cell = {columnId: 'foo', rowId: 'bar'};
    });
    after(function() {
        summaries.add('Test specific summary data here');
    });
})
