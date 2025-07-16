import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsService } from './services/settings.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'Eisenhower Agile';

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    // Initialize settings service to apply theme on app start
    this.settingsService.settings();
  }
}
