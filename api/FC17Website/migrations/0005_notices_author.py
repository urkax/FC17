# Generated by Django 3.0.2 on 2020-01-29 09:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('FC17Website', '0004_users_adminlevel'),
    ]

    operations = [
        migrations.AddField(
            model_name='notices',
            name='author',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='FC17Website.Users'),
        ),
    ]