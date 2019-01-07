import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {DataService} from '../../services/data/data.service';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import {AdminService} from '../../services/admin/admin.service';
import {UtilityService} from '../../services/utility/utility.service';

export const ProvidersExport = [
  ToastrService,
  AuthService,
  DataService,
  MapService,
  JourneyService,
  AdminService,
  UtilityService
];
