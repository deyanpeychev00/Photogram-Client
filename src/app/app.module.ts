import { NgModule } from '@angular/core';

/* import all modules, services and components from package export files */
import {ProvidersExport} from './export/providers-services/export-providers';
import {ComponentsExport} from './export/components/export-components';
import {ExportComponentsObj} from './export/components/export-components-obj';
import {ModulesExport} from './export/modules/export-modules';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { EditPictureFormComponent } from './components/edit-picture-form/edit-picture-form.component';

@NgModule({
  declarations: [...ComponentsExport, AdminPanelComponent, EditPictureFormComponent],
  imports: [...ModulesExport],
  providers: [...ProvidersExport],
  bootstrap: [ExportComponentsObj.App]
})
export class AppModule { }
