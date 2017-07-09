(function(){
  'use strict';

  angular.module('sections.profile')
  .controller('ProfileController', ProfileController);

  /* @ngInject */
  function ProfileController(AuthService, AppointmentModel, RatingModel, UserModel, toaster, $moment, $scope){

    var vm = this,
        user = new UserModel(AuthService.user()),
        appointmentQueryParams = {orderby: 'created_at', order: 'desc', user_id: user.id},
        mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;


    activate();

    function activate(){

      angular.extend(vm, {
          user:                 user,
          appointments:         AppointmentModel.query(appointmentQueryParams),
          loadMoreAppointments: loadMoreAppointments,
          activateRating:       activateRating,
          canSubmitRating:      canSubmitRating,
          submitRating:         submitRating,
          updateUser:           updateUser
      });

    }

    function loadMoreAppointments() {
      if (vm.busyAp) {
        return;
      }
      vm.busyAp = true;

      var page = vm.appointments.current_page + 1;
      var queryParams = angular.extend({page: page}, appointmentQueryParams);
      var oldData = vm.appointments.data;

      AppointmentModel.query(queryParams, function (data) {
        vm.busyAp = false;
        vm.appointments = data;
        vm.appointments.data = oldData.concat(data.data);
      });
    }

    function activateRating(appointment) {
      appointment.rating = new RatingModel();
    }

    function canSubmitRating(appointment) {
      var appointmentDeadline = $moment(appointment.deadline, "YYYY-MM-DD HH");
      var now = $moment();

      return appointment && now.diff(appointmentDeadline, 'hours') > 1;
    }

    function submitRating(form, appointment) {
      form.$setPristine(); // clear form
      form.$setUntouched();

      appointment.rating.mastori_id = appointment.mastori.id;
      appointment.rating.appointment_id = appointment.id;

      appointment.rating.$saveForMastori(function(saved){
          toaster.pop('success', "Κομπλέ!", "Σε ευχαριστούμε για την κριτική σου! Θα δημοσιευτεί μόλις την εγκρίνει ο μαστορο-admin! By the way, μόλις κέρδισες " + saved.points_rewarded + " μαστοροπόντους!!");
      }, function(error){
          toaster.pop('error', "Ουπς!", "Κάτι δεν πήγε καλά.. Ξαναπροσπάθησε παρακαλώ!");
      });
    }

    function updateUser(form) {
      form.$setPristine(); // clear form
          form.$setUntouched();

      $scope.user.$save(function(saved) {
      // update user in localStorage
          AuthService.updateUserData(saved);
          toaster.pop('success', "Ετοιμος!", "Τα στοιχεία του λογαριασμού σου ανανεώθηκαν με επιτυχία!");
      }, function(error){
          toaster.pop('error', "Ουπς!", "Κάτι δεν πήγε καλά.. Ξαναπροσπάθησε παρακαλώ!");
      });
    }
  }

})();