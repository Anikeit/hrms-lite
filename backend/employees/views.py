from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer, AttendanceCreateSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceCreateSerializer
        return AttendanceSerializer

    @action(detail=False, methods=['get'], url_path='employee/(?P<employee_id>[^/.]+)')
    def by_employee(self, request, employee_id=None):
        """
        Get attendance records for a specific employee
        """
        try:
            employee = get_object_or_404(Employee, employee_id=employee_id)
            attendances = Attendance.objects.filter(employee=employee)
            serializer = self.get_serializer(attendances, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            # Extract user-friendly error message from ValidationError
            error_message = self._extract_error_message(e)
            return Response(
                {'error': error_message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except IntegrityError as e:
            # Handle database integrity errors (like unique constraint violations)
            error_message = self._handle_integrity_error(e, request.data)
            return Response(
                {'error': error_message},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _extract_error_message(self, validation_error):
        """
        Extract user-friendly error message from ValidationError
        """
        if hasattr(validation_error, 'detail'):
            detail = validation_error.detail
            
            # Handle non_field_errors
            if isinstance(detail, dict) and 'non_field_errors' in detail:
                non_field_errors = detail['non_field_errors']
                if isinstance(non_field_errors, list) and len(non_field_errors) > 0:
                    return str(non_field_errors[0])
            
            # Handle field-specific errors
            if isinstance(detail, dict):
                for field, errors in detail.items():
                    if isinstance(errors, list) and len(errors) > 0:
                        return str(errors[0])
                    elif isinstance(errors, str):
                        return errors
            
            # If detail is a list, return first item
            if isinstance(detail, list) and len(detail) > 0:
                return str(detail[0])
            
            return str(detail)
        
        return str(validation_error)

    def _handle_integrity_error(self, integrity_error, request_data):
        """
        Handle database integrity errors and return user-friendly messages
        """
        error_str = str(integrity_error)
        
        # Check if it's a unique constraint violation for attendance
        if 'unique' in error_str.lower() or 'duplicate' in error_str.lower():
            try:
                employee_id = request_data.get('employee')
                date = request_data.get('date')
                
                if employee_id:
                    employee = Employee.objects.get(id=employee_id)
                    employee_name = employee.full_name
                    employee_id_str = employee.employee_id
                    
                    if date:
                        from datetime import datetime
                        try:
                            if isinstance(date, str):
                                date_obj = datetime.strptime(date, '%Y-%m-%d').date()
                            else:
                                date_obj = date
                            formatted_date = date_obj.strftime('%B %d, %Y')
                        except:
                            formatted_date = date
                    else:
                        formatted_date = 'this date'
                    
                    return f"Attendance for {employee_name} ({employee_id_str}) on {formatted_date} has already been recorded. Please select a different date or employee."
            except Employee.DoesNotExist:
                pass
            
            return "This attendance record already exists. Please select a different date or employee."
        
        return "A database error occurred. Please try again."
