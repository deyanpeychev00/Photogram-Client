import {ServerService} from "../../services/server/server.service";
import {ToastrService} from '../../services/toastr/toastr.service';
import {AuthService} from '../../services/auth/auth.service';
import {DataService} from '../../services/data/data.service';
import {MapService} from '../../services/map/map.service';
import {JourneyService} from '../../services/journey/journey.service';
import {AdminService} from '../../services/admin/admin.service';

export const ProvidersExport = [
  ServerService,
  ToastrService,
  AuthService,
  DataService,
  MapService,
  JourneyService,
  AdminService
];
