# Generated by Django 3.0.2 on 2020-02-04 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FC17Website', '0003_remove_team_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='scoreDaily',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='team',
            name='scoreTotal',
            field=models.IntegerField(default=0),
        ),
    ]