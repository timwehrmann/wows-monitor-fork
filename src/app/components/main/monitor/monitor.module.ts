import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorComponent } from './monitor.component';
import { PlayerComponent } from './player/player.component';
import { ValueLabelComponent } from './player/value-label/value-label.component';
import { ValueLabelMdiComponent } from './player/value-label-mdi/value-label-mdi.component';
import { TeamComponent } from './team/team.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    MonitorComponent,
    PlayerComponent,
    TeamComponent,
    ValueLabelMdiComponent,
    ValueLabelComponent
  ],
  imports: [
    CommonModule,
    MonitorRoutingModule,
    SharedModule,
    CardModule,
    ScrollPanelModule,
    DialogModule,
    ContextMenuModule,
    MenuModule,
    TooltipModule,
    FontAwesomeModule,
    TranslateModule.forChild()
  ],
  providers: [
  ]
})
export class MonitorModule { }
