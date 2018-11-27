import { NgModule } from '@angular/core';

/* import all modules, services and components from package export files */
import {ProvidersExport} from './export/providers-services/export-providers';
import {ComponentsExport} from './export/components/export-components';
import {ExportComponentsObj} from './export/components/export-components-obj';
import {ModulesExport} from './export/modules/export-modules';
import { AdminUsersTableComponent } from './components/admin-users-table/admin-users-table.component';
import { AdminJourneysTableComponent } from './components/admin-journeys-table/admin-journeys-table.component';
import { AdminImagesTableComponent } from './components/admin-images-table/admin-images-table.component';
import { UserPageComponent } from './components/user-page/user-page.component';


@NgModule({
  declarations: [...ComponentsExport, AdminUsersTableComponent, AdminJourneysTableComponent, AdminImagesTableComponent, UserPageComponent],
  imports: [...ModulesExport],
  providers: [...ProvidersExport],
  bootstrap: [ExportComponentsObj.App]
})
export class AppModule { }
