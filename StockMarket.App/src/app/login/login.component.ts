import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/AuthenticationService';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService        
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    } 

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
      
        this.submitted = true;
       
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f['email'].value, this.f['password'].value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from query parameters or default to home page
                   
                    //const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl("home");
                },
                error: error => {                   
                    this.loading = false;
                }
            });
    }

}
