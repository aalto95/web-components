import { CommonModule } from '@angular/common'
import {
  type AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  type ElementRef,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('colorSelect') colorSelectRef!: ElementRef<HTMLElement>
  loading = false
  disabled = false

  checkboxChecked = false
  toggleChecked = false
  selectedColor = ''
  dialogOpen = false
  dialogSize: 'small' | 'medium' | 'large' = 'medium'
  badgeVariants: Array<'default' | 'primary' | 'success' | 'warning' | 'danger'> = [
    'default',
    'primary',
    'success',
    'warning',
    'danger',
  ]

  colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
  ]

  ngAfterViewInit() {
    if (this.colorSelectRef) {
      const el = this.colorSelectRef.nativeElement as unknown as { options: unknown }
      el.options = this.colorOptions
    }
  }

  toggleLoading() {
    this.loading = !this.loading
  }

  toggleDisabled() {
    this.disabled = !this.disabled
  }

  handleClick() {
    alert('Clicked!')
  }

  onCheckboxChange(e: Event) {
    this.checkboxChecked = (e as CustomEvent).detail.checked
  }

  onToggleChange(e: Event) {
    this.toggleChecked = (e as CustomEvent).detail.checked
  }

  onColorChange(e: Event) {
    this.selectedColor = (e as CustomEvent).detail.value
  }

  openDialog() {
    this.dialogOpen = true
  }

  closeDialog() {
    this.dialogOpen = false
  }

  removeBadge(e: Event) {
    const badge = (e.target as HTMLElement).closest('ui-badge')
    if (badge) badge.remove()
  }
}
