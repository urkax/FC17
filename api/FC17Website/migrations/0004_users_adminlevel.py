# Generated by Django 3.0.2 on 2020-01-29 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FC17Website', '0003_auto_20200128_2113'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='adminLevel',
            field=models.IntegerField(default=0),
        ),
    ]