import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@components/base.component';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontSize, LayoutMode, PlayerBackgrounds, PlayerBackgroundsMode, TeamWinrate } from '@generated/models';
import { ElectronService, ElectronServiceToken } from '@interfaces/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { ScrollService } from '@services/scroll.service';
import { SettingsService } from '@services/settings.service';
import { Observable } from 'rxjs';

declare type ExtSelectItem = { label$: Observable<string>; value: any };

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  faDesktop = faDesktop;

  showExaplanationDialog = false;

  fontSizeOptions: ExtSelectItem[] = [
    {
      label$: this.translate.get('settings.appearance.fontsize.items.small'),
      value: FontSize.Small
    },
    {
      label$: this.translate.get('settings.appearance.fontsize.items.normal'),
      value: FontSize.Normal
    },
    {
      label$: this.translate.get('settings.appearance.fontsize.items.big'),
      value: FontSize.Big
    },
    {
      label$: this.translate.get('settings.appearance.fontsize.items.huge'),
      value: FontSize.Huge
    }
  ];

  layoutModeOptions: ExtSelectItem[] = [
    {
      label$: this.translate.get('settings.appearance.layoutMode.items.normal'),
      value: LayoutMode.Normal
    },
    {
      label$: this.translate.get('settings.appearance.layoutMode.items.compact'),
      value: LayoutMode.Compact
    },
    {
      label$: this.translate.get('settings.appearance.layoutMode.items.legacy'),
      value: LayoutMode.Legacy
    }
  ];

  playerBackgroundsOptions: ExtSelectItem[] = [
    {
      label$: this.translate.get('settings.appearance.playerBackgrounds.items.pr'),
      value: PlayerBackgrounds.Pr
    },
    {
      label$: this.translate.get('settings.appearance.playerBackgrounds.items.wr'),
      value: PlayerBackgrounds.Wr
    },
    {
      label$: this.translate.get('settings.appearance.playerBackgrounds.items.accwr'),
      value: PlayerBackgrounds.AccWr
    },
    {
      label$: this.translate.get('settings.appearance.playerBackgrounds.items.avgDmg'),
      value: PlayerBackgrounds.AvgDmg
    }
  ];

  playerBackgroundsModeOptions: ExtSelectItem[] = [
    {
      label$: this.translate.get('settings.appearance.playerBackgroundsMode.items.disabled'),
      value: PlayerBackgroundsMode.Disabled
    },
    {
      label$: this.translate.get('settings.appearance.playerBackgroundsMode.items.background'),
      value: PlayerBackgroundsMode.Background
    },
    {
      label$: this.translate.get('settings.appearance.playerBackgroundsMode.items.border'),
      value: PlayerBackgroundsMode.Border
    }
  ];

  teamWinrateOptions: ExtSelectItem[] = [
    {
      label$: this.translate.get('settings.appearance.teamWinrate.items.average'),
      value: TeamWinrate.Average
    },
    {
      label$: this.translate.get('settings.appearance.teamWinrate.items.weighted'),
      value: TeamWinrate.Weighted
    },
    {
      label$: this.translate.get('settings.appearance.teamWinrate.items.median'),
      value: TeamWinrate.Median
    }
  ];

  public monitorConfig = this.settingsService.form.monitorConfig;

  constructor(public settingsService: SettingsService,
              private translate: TranslateService,
              @Inject(ElectronServiceToken) private electronService: ElectronService,
              private activatedRoute: ActivatedRoute,
              private scrollService: ScrollService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.activatedRoute.params
      .pipe(this.untilDestroy())
      .subscribe(params => {
        if (params.goto) {
          this.scrollService.scrollToAnchor(params.goto);
        }
      });
  }

  async selectReplaysPath() {
    const odr = await this.electronService.showOpenDialog({
      defaultPath: this.settingsService.form.selectedDirectory.model,
      properties: ['openDirectory']
    });
    if (odr && odr.filePaths && odr.filePaths.length > 0) {
      this.ngZone.run(() => this.monitorConfig.overwriteReplaysDirectory.setValue(odr.filePaths[0]));
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
