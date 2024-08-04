Modify description input. 

Description input is not a part of the state therefore desc value loosing on moving through history.
If desc must be part of the state then its better to transform emptyRow into class and use it as state row objects.

If desc value is empty then input is narrow and no horizontal scroll, if desc has value then input takes 40-50% width and it is horz scroll.