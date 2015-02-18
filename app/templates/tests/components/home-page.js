define(['components/home-page/home-page-ui'], function(homePage) {
  //var HomePageViewModel = homePage.viewModel;
  var homePageViewModel = homePage.viewModel;
  var template = homePage.template;

  describe('Home page view model', function() {

    it('should supply a friendly message which changes when acted upon', function() {
      //var instance = new HomePageViewModel();
      var instance = homePageViewModel.createViewModel({test:'test'}, template);
      expect(instance.message()).toContain('Welcome to ');

      // See the message change
      instance.doSomething();
      expect(instance.message()).toContain('You invoked doSomething()');
    });

  });

});
