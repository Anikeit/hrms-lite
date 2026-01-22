from rest_framework import serializers
from .models import Employee, Attendance
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_employee_id(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Employee ID is required.")
        return value.strip()

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required.")
        return value.strip()

    def validate_department(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Department is required.")
        return value.strip()


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_id', 'employee_name', 'date', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_status(self, value):
        if value not in ['Present', 'Absent']:
            raise serializers.ValidationError("Status must be either 'Present' or 'Absent'.")
        return value


class AttendanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'date', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_status(self, value):
        if value not in ['Present', 'Absent']:
            raise serializers.ValidationError("Status must be either 'Present' or 'Absent'.")
        return value

    def validate(self, attrs):
        """
        Validate that attendance for this employee on this date doesn't already exist
        """
        employee = attrs.get('employee')
        date = attrs.get('date')
        
        if employee and date:
            existing_attendance = Attendance.objects.filter(
                employee=employee,
                date=date
            ).exists()
            
            if existing_attendance:
                employee_name = employee.full_name
                employee_id = employee.employee_id
                formatted_date = date.strftime('%B %d, %Y')
                raise serializers.ValidationError(
                    f"Attendance for {employee_name} ({employee_id}) on {formatted_date} has already been recorded. Please select a different date or employee."
                )
        
        return attrs
